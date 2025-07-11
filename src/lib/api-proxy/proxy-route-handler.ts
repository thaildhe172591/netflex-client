import { copyHeaders } from "./proxy-utils";

type RouteHandlerProxyTarget = {
  requestUrl: string;
  bearerToken?: string;
};

export async function proxyRouteHandler(
  request: Request,
  { requestUrl, bearerToken }: RouteHandlerProxyTarget
): Promise<Response> {
  const headers = copyHeaders(request.headers);
  if (bearerToken) {
    headers.set("Authorization", `Bearer ${bearerToken}`);
  }

  return fetch(requestUrl, {
    headers,
    method: request.method,
    body: request.body,
    // @ts-expect-error Duplex property is missing in types
    duplex: "half",
  });
}
