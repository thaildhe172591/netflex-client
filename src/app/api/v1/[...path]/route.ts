import { proxyRouteHandler } from "@/lib/api-proxy";
import { cookies } from "next/headers";

async function proxyRequest(req: Request) {
  const cookie = await cookies();
  const accessToken = cookie.get("access_token")?.value;

  const url = new URL(req.url);
  const rawBaseUrl = process.env.BASE_API_URL ?? "";
  if (!rawBaseUrl) {
    return new Response("BASE_API_URL is not configured", { status: 500 });
  }

  const baseUrl = rawBaseUrl.replace(/\/+$/, "");
  const normalizedPath =
    baseUrl.endsWith("/api/v1") && url.pathname.startsWith("/api/v1/")
      ? url.pathname.substring("/api/v1".length)
      : url.pathname;

  const target = `${baseUrl}${normalizedPath}${url.search}`;

  console.log(`[Proxy] Routing to: ${target}`);
  console.log(`[Proxy] Access Token present: ${!!accessToken}`);

  try {
    const response = await proxyRouteHandler(req, {
      requestUrl: target,
      bearerToken: accessToken,
    });
    console.log(`[Proxy] Response Status: ${response.status}`);
    return response;
  } catch (err) {
    console.error("[Proxy] Connection Error:", err);
    return new Response("Proxy Error", { status: 500 });
  }
}

export const GET = proxyRequest;
export const POST = proxyRequest;
export const PUT = proxyRequest;
export const DELETE = proxyRequest;
