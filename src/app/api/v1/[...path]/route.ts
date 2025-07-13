import { proxyRouteHandler } from "@/lib/api-proxy";
import { cookies } from "next/headers";

async function proxyRequest(req: Request) {
  const cookie = await cookies();
  const accessToken = cookie.get("access_token")?.value;

  const url = new URL(req.url);
  const target = `${process.env.BASE_API_URL}${url.pathname}${url.search}`;

  return proxyRouteHandler(req, {
    requestUrl: target,
    bearerToken: accessToken,
  });
}

export const GET = proxyRequest;
export const POST = proxyRequest;
export const PUT = proxyRequest;
export const DELETE = proxyRequest;
