import { getSessionUser, extractAuthCookies, CONFIG } from "../../../lib/ncb-utils";

export async function POST(req: Request) {
  const user = await getSessionUser(req.headers.get("cookie"));
  if (!user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  const { itemId } = await req.json().catch(() => ({ itemId: null }));
  if (!itemId) {
    return new Response(JSON.stringify({ error: "No item specified" }), { status: 400 });
  }

  const authCookies = extractAuthCookies(req.headers.get("cookie"));

  // 1. Fetch item details to get price
  const itemRes = await fetch(`${CONFIG.dataApiUrl}/read/items/${itemId}?Instance=${CONFIG.instance}`, {
    headers: { "X-Database-Instance": CONFIG.instance, "Cookie": authCookies }
  });
  
  const item = await itemRes.json();
  if (!item || item.error) {
    return new Response(JSON.stringify({ error: "Item not found" }), { status: 404 });
  }

  // 2. Fetch user to check balance
  const userRes = await fetch(`${CONFIG.dataApiUrl}/read/users?Instance=${CONFIG.instance}`, {
    headers: { "X-Database-Instance": CONFIG.instance, "Cookie": authCookies }
  });
  const userRecords = await userRes.json();
  const dbUser = Array.isArray(userRecords) && userRecords.length > 0 ? userRecords[0] : null;

  if (!dbUser) {
    return new Response(JSON.stringify({ error: "User profile not found in database" }), { status: 404 });
  }

  if (dbUser.off_chain_floki < item.price) {
    return new Response(JSON.stringify({ 
      error: `Not enough FLOKI. You need ${item.price} FLOKI for this item.` 
    }), { status: 400 });
  }

  // 3. Deduct balance
  const newFlokiBalance = dbUser.off_chain_floki - item.price;
  await fetch(`${CONFIG.dataApiUrl}/update/users/${dbUser.id}?Instance=${CONFIG.instance}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "X-Database-Instance": CONFIG.instance,
      "Cookie": authCookies,
    },
    body: JSON.stringify({ off_chain_floki: newFlokiBalance })
  });

  // 4. Insert into inventory
  const inventoryId = crypto.randomUUID();
  const insertInventoryRes = await fetch(`${CONFIG.dataApiUrl}/create/inventory?Instance=${CONFIG.instance}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Database-Instance": CONFIG.instance,
      "Cookie": authCookies,
    },
    body: JSON.stringify({
      id: inventoryId,
      user_id: user.id,
      item_id: item.id,
      quantity: 1
    })
  });

  if (!insertInventoryRes.ok) {
    return new Response(JSON.stringify({ error: "Failed to add item to inventory." }), { status: 500 });
  }

  return new Response(JSON.stringify({ 
    success: true, 
    newBalance: newFlokiBalance
  }), { status: 200 });
}
