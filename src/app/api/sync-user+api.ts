import { getSessionUser, extractAuthCookies, CONFIG } from "../../lib/ncb-utils";

export async function POST(req: Request) {
  const { wallet_address } = await req.json().catch(() => ({ wallet_address: null }));
  const user = await getSessionUser(req.headers.get("cookie"));
  
  if (!user && !wallet_address) {
    return new Response(JSON.stringify({ error: "Unauthorized: No user session or wallet" }), { status: 401 });
  }

  const authCookies = extractAuthCookies(req.headers.get("cookie"));
  const effectiveUserId = user?.id || wallet_address; // Fallback to wallet address if Web3-only

  // 1. Fetch current user record (by NCB user ID or Wallet Address)
  const queryField = user ? "user_id" : "wallet_address";
  const queryValue = user ? user.id : wallet_address;
  
  const readUrl = `${CONFIG.dataApiUrl}/query/users?${queryField}=${queryValue}&Instance=${CONFIG.instance}`;
  const readRes = await fetch(readUrl, {
    method: "POST",
    headers: {
      "X-Database-Instance": CONFIG.instance,
      "Cookie": authCookies,
    }
  });

  let dbUser = null;
  if (readRes.ok) {
    const records = await readRes.json();
    dbUser = Array.isArray(records) && records.length > 0 ? records[0] : null;
  }

  if (!dbUser) {
    // Create new user record
    const flokiReward = 5 + (wallet_address ? 500 : 0);

    const createUrl = `${CONFIG.dataApiUrl}/create/users?Instance=${CONFIG.instance}`;
    await fetch(createUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Database-Instance": CONFIG.instance,
        // Don't forward empty cookies for web3-only creations
        ...(authCookies ? { "Cookie": authCookies } : {})
      },
      body: JSON.stringify({
        id: effectiveUserId,
        user_id: effectiveUserId,
        wallet_address: wallet_address || null,
        off_chain_floki: flokiReward,
      })
    });

    // Trigger SES Email Lambda asynchronously
    if (process.env.SEND_SIGNUP_EMAIL_URL) {
      fetch(process.env.SEND_SIGNUP_EMAIL_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: user.id,
          wallet_address: wallet_address || null,
        }),
      }).catch(err => console.error("Failed to trigger signup email Lambda:", err));
    }

    return new Response(JSON.stringify({ success: true, floki: flokiReward }), { status: 200 });
  } else {
    // User exists. Check if we need to award the 500 FLOKI wallet linking bonus
    if (wallet_address && !dbUser.wallet_address) {
      const newFloki = dbUser.off_chain_floki + 500;
      
      const updateUrl = `${CONFIG.dataApiUrl}/update/users/${dbUser.id}?Instance=${CONFIG.instance}`;
      await fetch(updateUrl, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "X-Database-Instance": CONFIG.instance,
          "Cookie": authCookies,
        },
        body: JSON.stringify({
          wallet_address: wallet_address,
          off_chain_floki: newFloki,
        })
      });

      return new Response(JSON.stringify({ success: true, floki: newFloki }), { status: 200 });
    }

    return new Response(JSON.stringify({ success: true, floki: dbUser.off_chain_floki }), { status: 200 });
  }
}
