import { useReadContract, useActiveAccount } from "thirdweb/react";
import { getContract, toTokens } from "thirdweb";
import { ACTIVE_CHAIN, FLOKI_CONTRACT_ADDRESS } from "@/lib/constants";
import { client } from "@/lib/thirdweb";
import { balanceOf, decimals } from "thirdweb/extensions/erc20";

export function useFlokiBalance() {
  const activeAccount = useActiveAccount();

  const flokiContract = getContract({
    client,
    chain: ACTIVE_CHAIN,
    address: FLOKI_CONTRACT_ADDRESS,
  });

  const { data: balanceWei, isLoading: isLoadingBalance } = useReadContract(balanceOf, {
    contract: flokiContract,
    address: activeAccount?.address || "0x0000000000000000000000000000000000000000",
    queryOptions: {
      enabled: !!activeAccount,
    },
  });

  const { data: tokenDecimals } = useReadContract(decimals, {
    contract: flokiContract,
    queryOptions: {
      enabled: !!activeAccount,
    },
  });

  let formattedBalance = "0";
  if (balanceWei !== undefined && tokenDecimals !== undefined) {
    formattedBalance = toTokens(balanceWei, tokenDecimals);
  }

  return {
    balance: Number(formattedBalance),
    formattedBalance,
    isLoading: isLoadingBalance,
  };
}
