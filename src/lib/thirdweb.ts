import { createThirdwebClient } from "thirdweb";

export const client = createThirdwebClient({
  clientId: process.env.EXPO_PUBLIC_THIRDWEB_CLIENT_ID || "your_thirdweb_client_id_here",
});
