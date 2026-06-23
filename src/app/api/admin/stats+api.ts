import { getSessionUser, extractAuthCookies, CONFIG } from "../../../lib/ncb-utils";

export async function GET(req: Request) {
  const user = await getSessionUser(req.headers.get("cookie"));
  
  if (!user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  const authCookies = extractAuthCookies(req.headers.get("cookie"));
  const readUrl = `${CONFIG.dataApiUrl}/read/users?Instance=${CONFIG.instance}`;
  
  try {
    const readRes = await fetch(readUrl, {
      method: "GET",
      headers: {
        "X-Database-Instance": CONFIG.instance,
        "Cookie": authCookies,
      }
    });

    if (readRes.ok) {
      const records = await readRes.json();
      const userCount = Array.isArray(records) ? records.length : 0;
      return new Response(JSON.stringify({ userCount }), { status: 200 });
    }
    
    // If we fail or hit RLS issues, return 0 or an error state
    return new Response(JSON.stringify({ error: "Failed to fetch users" }), { status: readRes.status });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
  }
}
