import { getSessionUser, CONFIG, extractAuthCookies } from "@/lib/ncb-utils";
import { createThirdwebClient, getContract, prepareContractCall, sendAndConfirmTransaction } from "thirdweb";
import { privateKeyToAccount } from "thirdweb/wallets";
import { bsc } from "thirdweb/chains";

const UNAUTHORIZED = (msg = "Unauthorized") => Response.json({ error: msg }, { status: 401 });
const BAD_REQUEST = (msg = "Bad Request") => Response.json({ error: msg }, { status: 400 });
const INTERNAL_ERROR = (msg = "Internal Server Error") => Response.json({ error: msg }, { status: 500 });

// Ensure we have required environment variables
const clientId = process.env.EXPO_PUBLIC_THIRDWEB_CLIENT_ID || process.env.THIRDWEB_CLIENT_ID;
const privateKey = process.env.PRIVATE_KEY;
const generatorContractAddress = process.env.EXPO_PUBLIC_GENERATOR_ADDRESS;

export async function POST(req: Request) {
  try {
    const user = await getSessionUser(req.headers.get("cookie"));
    if (!user) return UNAUTHORIZED();

    const body = await req.json();
    const amountToConvert = parseInt(body.amount);

    if (!amountToConvert || amountToConvert <= 0) {
      return BAD_REQUEST("Invalid amount");
    }

    if (!clientId || !privateKey || !generatorContractAddress) {
      console.error("Missing environment variables for Thirdweb conversion");
      return INTERNAL_ERROR("Server misconfiguration");
    }

    // 1. Fetch user's off-chain Floki balance
    const cookieHeader = req.headers.get("cookie") || "";
    const authCookies = extractAuthCookies(cookieHeader);

    // Get the user's current record from NCB. We filter by user_id to find their specific row in 'users' table
    // Assuming the user record has 'user_id' as their ID or 'id'
    const readUrl = `${CONFIG.dataApiUrl}/read/users?user_id=${user.id}&Instance=${CONFIG.instance}`;
    const readRes = await fetch(readUrl, {
      headers: {
        "Content-Type": "application/json",
        "X-Database-Instance": CONFIG.instance,
        "Cookie": authCookies,
      },
    });

    if (!readRes.ok) {
      return INTERNAL_ERROR("Failed to read user data");
    }

    const userData = await readRes.json();
    // NoCodeBackend returns an array for reads
    const userRecord = Array.isArray(userData) ? userData[0] : userData;

    if (!userRecord || !userRecord.wallet_address) {
      return BAD_REQUEST("User record or wallet address not found");
    }

    const currentOffChain = parseInt(userRecord.off_chain_floki) || 0;

    if (currentOffChain < amountToConvert) {
      return BAD_REQUEST("Insufficient off-chain Floki balance");
    }

    // 2. Perform On-Chain Conversion using Thirdweb SDK v5
    const client = createThirdwebClient({ clientId });
    const account = privateKeyToAccount({ client, privateKey });
    
    const contract = getContract({
      client,
      chain: bsc,
      address: generatorContractAddress,
    });

    // The amount needs to be formatted with 18 decimals usually, assuming Floki is 18 decimals
    // 1 Floki = 10^18 wei
    const amountInWei = BigInt(amountToConvert) * BigInt(10 ** 18);

    const tx = prepareContractCall({
      contract,
      method: "function convertFloki(address to, uint256 amount)",
      params: [userRecord.wallet_address, amountInWei],
    });

    // Send and wait for confirmation
    const receipt = await sendAndConfirmTransaction({
      transaction: tx,
      account,
    });

    if (!receipt || receipt.status !== "success") {
      return INTERNAL_ERROR("Transaction failed on-chain");
    }

    // 3. Deduct off-chain balance and update last_checked_onchain
    const newBalance = currentOffChain - amountToConvert;
    const now = new Date().toISOString().slice(0, 19).replace('T', ' '); // Format DATETIME for MySQL typically 'YYYY-MM-DD HH:mm:ss'

    const updatePayload = {
      off_chain_floki: newBalance,
      last_checked_onchain: now
    };

    const updateUrl = `${CONFIG.dataApiUrl}/update/users/${userRecord.id}?Instance=${CONFIG.instance}`;
    const updateRes = await fetch(updateUrl, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "X-Database-Instance": CONFIG.instance,
        "Cookie": authCookies,
      },
      body: JSON.stringify(updatePayload),
    });

    if (!updateRes.ok) {
      // Note: On-chain succeeded but DB update failed! Needs manual intervention log in production.
      console.error(`CRITICAL: On-chain conversion succeeded for ${userRecord.wallet_address} but DB update failed!`);
      return INTERNAL_ERROR("Conversion succeeded but database update failed");
    }

    return Response.json({ success: true, txHash: receipt.transactionHash, newBalance });

  } catch (err: any) {
    console.error("Conversion API Error:", err);
    return INTERNAL_ERROR(err.message || "An unexpected error occurred");
  }
}
