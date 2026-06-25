import { createThirdwebClient, getContract, defineChain } from "thirdweb";
import { getWalletBalance } from "thirdweb/wallets";

async function main() {
  const clientId = "1a16826f0d0fb64e41c86a79a3b46276";
  const client = createThirdwebClient({ clientId });
  
  const address = "0xC4169E7DB31AC8FA95de86EC9F10F195A43025a8";
  
  // BSC Mainnet
  const bscChain = defineChain(56);
  // opBNB Testnet
  const opBnbTestnet = defineChain(5611);

  // FLOKI on BSC
  const flokiBscAddress = "0xfb5b838b6cfeedc2873ab27866079ac55363d37e";

  try {
    const bscBalance = await getWalletBalance({
      client,
      chain: bscChain,
      address,
      tokenAddress: flokiBscAddress,
    });
    console.log(`BSC Mainnet FLOKI Balance: ${bscBalance.displayValue} ${bscBalance.symbol}`);
  } catch (e: any) {
    console.error("Error getting BSC FLOKI:", e.message);
  }

  // FLOKI on opBNB testnet (from .env or constants if defined, otherwise Native balance)
  try {
    const nativeBsc = await getWalletBalance({
      client,
      chain: bscChain,
      address,
    });
    console.log(`BSC Mainnet BNB Balance: ${nativeBsc.displayValue} ${nativeBsc.symbol}`);
  } catch (e: any) {
    console.error("Error getting BSC BNB:", e.message);
  }
}

main();
