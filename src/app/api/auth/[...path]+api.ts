const CONFIG = {
  instance: process.env.NCB_INSTANCE!,
  apiUrl: process.env.NCB_AUTH_API_URL!, // Note: using NCB_AUTH_API_URL as per our .env
  secretKey: process.env.NCB_SECRET_KEY!,
};

export async function GET(req: Request) {
  const url = new URL(req.url);
  const pathStr = url.pathname.replace(/^\/api\/auth\//, '');
  return proxyRequest(req, pathStr);
}

export async function POST(req: Request) {
  const url = new URL(req.url);
  const pathStr = url.pathname.replace(/^\/api\/auth\//, '');
  return proxyRequest(req, pathStr, await req.text());
}

async function proxyRequest(req: Request, path: string, body?: string) {
  const reqUrl = new URL(req.url);
  // Ensure we pass the instance query parameter if not already present
  const searchParams = new URLSearchParams(reqUrl.search);
  searchParams.set("instance", CONFIG.instance);
  
  const url = `${CONFIG.apiUrl}/${path}?${searchParams.toString()}`;
  
  const headers = new Headers();
  headers.set("Content-Type", "application/json");
  headers.set("X-Database-Instance", CONFIG.instance);
  
  if (CONFIG.secretKey) {
    headers.set("Authorization", `Bearer ${CONFIG.secretKey}`);
  }
  
  const cookie = req.headers.get("cookie");
  if (cookie) {
    headers.set("Cookie", cookie);
  }

  const res = await fetch(url, {
    method: req.method,
    headers,
    body: body || undefined,
  });

  const data = await res.text();
  
  const responseHeaders = new Headers();
  responseHeaders.set("Content-Type", "application/json");

  // Forward Set-Cookie from NoCodeBackend to client exactly as is
  const setCookies = res.headers.getSetCookie?.() || [];
  for (const c of setCookies) {
    responseHeaders.append("Set-Cookie", c);
  }

  return new Response(data, {
    status: res.status,
    headers: responseHeaders,
  });
}
