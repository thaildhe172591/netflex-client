import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const intercepts = ["/register", "/login"];

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  const userAgent = request.headers.get("user-agent") || "";
  const cookie = request.headers.get("cookie") || "";

  const isMobile =
    /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(userAgent);

  if (
    intercepts.includes(pathname.toLowerCase()) &&
    (isMobile || searchParams.get("_modal") != "1") &&
    request.headers.get("next-url") != null
  ) {
    const headers = new Headers();
    headers.append("rsc", "1");
    headers.append("cookie", cookie);
    const url = new URL(request.url);
    url.searchParams.delete("_modal");

    return NextResponse.rewrite(url, {
      request: {
        headers,
      },
    });
  }
  return NextResponse.next();
}
