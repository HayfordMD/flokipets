import { useSendTransaction } from "thirdweb/react";
import { showAlert } from "@/lib/utils";

export function useWeb3Transaction() {
  const { mutate: sendTx, isPending } = useSendTransaction();

  const executeTx = (
    transaction: any, 
    successMessage: string, 
    errorMessage: string, 
    onSuccessCallback?: () => void
  ) => {
    sendTx(transaction, {
      onSuccess: () => {
        if (onSuccessCallback) {
          onSuccessCallback();
        }
        showAlert("Success", successMessage);
      },
      onError: (error) => {
        console.error("Transaction failed:", error);
        showAlert("Error", errorMessage);
      }
    });
  };

  return { executeTx, isPending };
}
