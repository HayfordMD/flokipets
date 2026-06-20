import { getSessionUser, extractAuthCookies, CONFIG } from "../../lib/ncb-utils";

export async function POST(req: Request) {
  const user = await getSessionUser(req.headers.get("cookie"));
  if (!user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  const { wallet_address } = await req.json().catch(() => ({ wallet_address: null }));
  const authCookies = extractAuthCookies(req.headers.get("cookie"));

  // 1. Fetch current user record
  const readUrl = `${CONFIG.dataApiUrl}/read/users?Instance=${CONFIG.instance}`;
  const readRes = await fetch(readUrl, {
    headers: {
      "X-Database-Instance": CONFIG.instance,
      "Cookie": authCookies,
    }
  });

  const records = await readRes.json();
  const dbUser = Array.isArray(records) && records.length > 0 ? records[0] : null;

  if (!dbUser) {
    // Create new user record
    // +5 FLOKI for initial login
    // +500 FLOKI if they also linked a wallet immediately
    const flokiReward = 5 + (wallet_address ? 500 : 0);

    const createUrl = `${CONFIG.dataApiUrl}/create/users?Instance=${CONFIG.instance}`;
    await fetch(createUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Database-Instance": CONFIG.instance,
        "Cookie": authCookies,
      },
      body: JSON.stringify({
        id: user.id,
        user_id: user.id,
        wallet_address: wallet_address || null,
        off_chain_floki: flokiReward,
      })
    });

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
