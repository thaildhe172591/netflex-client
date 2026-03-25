import { NextRequest } from "next/server";

const DEFAULT_ALLOWED_ORIGINS = ["http://localhost:3000", "https://localhost:3000"];

function getAllowedOrigins() {
  const raw = process.env.ALLOWED_ORIGINS;
  if (!raw) return DEFAULT_ALLOWED_ORIGINS;
  return raw
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function resolveCorsHeaders(req: NextRequest): Headers {
  const origin = req.headers.get("origin");
  const requestMethod = req.headers.get("access-control-request-method") ?? "GET,HEAD,OPTIONS";
  const requestHeaders = req.headers.get("access-control-request-headers") ?? "Content-Type,Authorization,Range";
  const allowedOrigins = getAllowedOrigins();

  const headers = new Headers();
  headers.set("Vary", "Origin");

  if (!origin) {
    return headers;
  }

  if (!allowedOrigins.includes(origin)) {
    return headers;
  }

  headers.set("Access-Control-Allow-Origin", origin);
  headers.set("Access-Control-Allow-Credentials", "true");
  headers.set("Access-Control-Allow-Methods", requestMethod);
  headers.set("Access-Control-Allow-Headers", requestHeaders);
  headers.set(
    "Access-Control-Expose-Headers",
    "Content-Length,Content-Range,Accept-Ranges,Content-Type,Cache-Control"
  );
  headers.set("Access-Control-Max-Age", "86400");

  return headers;
}
