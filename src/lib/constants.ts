import { defineChain } from "thirdweb";

// Use the environment variable to determine the chain, fallback to opBNBTestnet
const envChain = process.env.EXPO_PUBLIC_ACTIVE_CHAIN;
export const ACTIVE_CHAIN = defineChain(envChain === 'BSC' ? 56 : (envChain === 'opBNB' ? 204 : 5611));

// Read the contract address from .env or fallback
export const FLOKI_CONTRACT_ADDRESS = process.env.EXPO_PUBLIC_FLOKI_CONTRACT_ADDRESS || "0x0000000000000000000000000000000000000000";

// Read the admin gas wallet from .env or fallback
export const ADMIN_GAS_WALLET = process.env.EXPO_PUBLIC_ADMIN_GAS_WALLET || "0x0000000000000000000000000000000000000000";

// Max off-chain Floki allowed before user must connect a wallet
export const MAX_OFFCHAIN_FLOKI = 10000;
