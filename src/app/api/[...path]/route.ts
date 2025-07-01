import { cookies } from "next/headers";

async function proxyRequest(req: Request) {
  const cookie = await cookies();
  const accessToken = cookie.get("access_token")?.value;

  const headers: HeadersInit = {
    "Content-Type": req.headers.get("Content-Type") || "application/json",
  };

  if (accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`;
  }

  const url = new URL(req.url);
  const target = `${process.env.API_URL}${url.pathname.replace(/\/api/, "")}${
    url.search
  }`;

  const res = await fetch(target, {
    method: req.method,
    headers: headers,
    body:
      req.method !== "GET" && req.method !== "HEAD"
        ? await req.text()
        : undefined,
  });

  return res;
}

export const GET = proxyRequest;
export const POST = proxyRequest;
export const PUT = proxyRequest;
export const DELETE = proxyRequest;
