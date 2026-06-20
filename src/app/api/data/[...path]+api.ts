import { getSessionUser, proxyToNCB } from "../../../lib/ncb-utils";

const UNAUTHORIZED = (msg = "Unauthorized") =>
  new Response(JSON.stringify({ error: msg }), {
    status: 401,
    headers: { "Content-Type": "application/json" },
  });

function getPathStr(req: Request) {
  const url = new URL(req.url);
  return url.pathname.replace(/^\/api\/data\//, '');
}

export async function GET(req: Request) {
  const pathStr = getPathStr(req);
  const user = await getSessionUser(req.headers.get("cookie"));
  if (!user) return UNAUTHORIZED();
  return proxyToNCB(req, pathStr);
}

export async function POST(req: Request) {
  const pathStr = getPathStr(req);
  const body = await req.text();
  const user = await getSessionUser(req.headers.get("cookie"));
  if (!user) return UNAUTHORIZED();

  if (pathStr.startsWith("create/") && body) {
    try {
      const parsed = JSON.parse(body);
      delete parsed.user_id;
      parsed.user_id = user.id;
      return proxyToNCB(req, pathStr, JSON.stringify(parsed));
    } catch {}
  }
  return proxyToNCB(req, pathStr, body);
}

export async function PUT(req: Request) {
  const pathStr = getPathStr(req);
  const body = await req.text();
  const user = await getSessionUser(req.headers.get("cookie"));
  if (!user) return UNAUTHORIZED();

  if (body) {
    try {
      const parsed = JSON.parse(body);
      delete parsed.user_id;
      return proxyToNCB(req, pathStr, JSON.stringify(parsed));
    } catch {}
  }
  return proxyToNCB(req, pathStr, body);
}

export async function DELETE(req: Request) {
  const pathStr = getPathStr(req);
  const user = await getSessionUser(req.headers.get("cookie"));
  if (!user) return UNAUTHORIZED();
  return proxyToNCB(req, pathStr);
}
