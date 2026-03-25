import { NextRequest, NextResponse } from "next/server";
import { resolveCorsHeaders } from "@/lib/cors";

const FORWARDED_REQUEST_HEADERS = [
  "accept",
  "accept-encoding",
  "accept-language",
  "if-modified-since",
  "if-none-match",
  "range",
  "user-agent",
] as const;

const PASSTHROUGH_RESPONSE_HEADERS = [
  "cache-control",
  "content-length",
  "content-range",
  "accept-ranges",
  "content-type",
  "etag",
  "last-modified",
] as const;

function inferMediaContentType(url: URL): string {
  const pathname = url.pathname.toLowerCase();
  if (pathname.endsWith(".mp4")) return "video/mp4";
  if (pathname.endsWith(".webm")) return "video/webm";
  if (pathname.endsWith(".mov")) return "video/quicktime";
  if (pathname.endsWith(".m3u8")) return "application/vnd.apple.mpegurl";
  if (pathname.endsWith(".m4s")) return "video/iso.segment";
  return "application/octet-stream";
}

function copyCorsHeaders(target: Headers, source: Headers) {
  for (const [key, value] of source.entries()) {
    target.set(key, value);
  }
}

function buildUpstreamHeaders(req: NextRequest): Headers {
  const headers = new Headers();
  for (const key of FORWARDED_REQUEST_HEADERS) {
    const value = req.headers.get(key);
    if (value) {
      headers.set(key, value);
    }
  }
  return headers;
}

async function proxy(req: NextRequest) {
  const corsHeaders = resolveCorsHeaders(req);
  const rawUrl = req.nextUrl.searchParams.get("url");

  if (!rawUrl) {
    const response = NextResponse.json(
      { error: "Missing url query parameter" },
      { status: 400 }
    );
    copyCorsHeaders(response.headers, corsHeaders);
    return response;
  }

  let target: URL;
  try {
    target = new URL(rawUrl);
    if (!target.protocol.startsWith("http")) {
      throw new Error("Unsupported protocol");
    }
  } catch {
    const response = NextResponse.json(
      { error: "Invalid media URL" },
      { status: 400 }
    );
    copyCorsHeaders(response.headers, corsHeaders);
    return response;
  }

  const upstream = await fetch(target.toString(), {
    method: req.method,
    headers: buildUpstreamHeaders(req),
    redirect: "follow",
    cache: "no-store",
  });

  if (req.method === "HEAD") {
    const responseHeaders = new Headers();
    for (const key of PASSTHROUGH_RESPONSE_HEADERS) {
      const value = upstream.headers.get(key);
      if (value) {
        responseHeaders.set(key, value);
      }
    }
    if (!responseHeaders.has("content-type")) {
      responseHeaders.set("content-type", inferMediaContentType(target));
    }
    copyCorsHeaders(responseHeaders, corsHeaders);
    return new NextResponse(null, {
      status: upstream.status,
      statusText: upstream.statusText,
      headers: responseHeaders,
    });
  }

  if (!upstream.body) {
    const response = NextResponse.json(
      {
        error: "Upstream media response has no body",
        upstreamStatus: upstream.status,
      },
      { status: 502 }
    );
    copyCorsHeaders(response.headers, corsHeaders);
    return response;
  }

  const responseHeaders = new Headers();
  for (const key of PASSTHROUGH_RESPONSE_HEADERS) {
    const value = upstream.headers.get(key);
    if (value) {
      responseHeaders.set(key, value);
    }
  }

  if (!responseHeaders.has("content-type")) {
    responseHeaders.set("content-type", inferMediaContentType(target));
  }

  if (!responseHeaders.has("accept-ranges")) {
    responseHeaders.set("accept-ranges", "bytes");
  }

  copyCorsHeaders(responseHeaders, corsHeaders);

  return new NextResponse(upstream.body, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers: responseHeaders,
  });
}

export async function OPTIONS(req: NextRequest) {
  const headers = resolveCorsHeaders(req);
  return new NextResponse(null, {
    status: 204,
    headers,
  });
}

export const GET = proxy;
export const HEAD = proxy;
