import * as fs from 'fs';

function loadEnv() {
  const envContent = fs.readFileSync('.env', 'utf-8');
  envContent.split('\n').forEach(line => {
    line = line.trim();
    if (line && !line.startsWith('#')) {
      const parts = line.split('=');
      if (parts.length >= 2) {
        const key = parts[0];
        const value = parts.slice(1).join('=');
        process.env[key] = value.replace(/^['"](.*)['"]$/, '$1');
      }
    }
  });
}
loadEnv();

async function main() {
  const secretKey = process.env.THIRDWEB_PRIVATE;
  const clientId = process.env.EXPO_PUBLIC_THIRDWEB_CLIENT_ID;

  if (!secretKey || !clientId) {
    console.error("Missing credentials");
    return;
  }

  // Use Thirdweb's REST API for Embedded Wallets
  // https://portal.thirdweb.com/connect/in-app-wallet/how-to/get-embedded-wallet-user-details
  const url = "https://embedded-wallet.thirdweb.com/api/2023-11-30/embedded-wallet/user-details?queryBy=walletAddress&walletAddress=0x5D54a946417Af025c033069175f39d0df28391FB";
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${secretKey}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      console.error("Failed to fetch:", response.status, await response.text());
      return;
    }

    const data = await response.json();
    console.log(JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Error:", error);
  }
}

main();
