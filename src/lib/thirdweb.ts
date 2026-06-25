import { createThirdwebClient } from "thirdweb";
import { inAppWallet } from "thirdweb/wallets";
import { ACTIVE_CHAIN } from "./constants";

export const client = createThirdwebClient({
  clientId: process.env.EXPO_PUBLIC_THIRDWEB_CLIENT_ID || "your_thirdweb_client_id_here",
});

import { Platform } from "react-native";

export const appWallets = [
  inAppWallet({
    auth: {
      options: ["email", "google", "apple", "facebook", "passkey"],
      mode: Platform.OS === "web" ? "popup" : undefined,
    },
  }),
];
