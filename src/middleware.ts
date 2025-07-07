import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const intercepts = ["/register", "/login"];

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  const cookie = request.headers.get("cookie") || "";

  if (
    intercepts.includes(pathname.toLowerCase()) &&
    searchParams.get("_modal") == "0" &&
    request.headers.get("next-url") != null
  ) {
    const headers = new Headers();
    headers.append("rsc", "1");
    headers.append("cookie", cookie);

    return NextResponse.rewrite(new URL(request.url.replace("_modal=0", "")), {
      request: {
        headers,
      },
    });
  }
  return NextResponse.next();
}
