import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

const intercepts = ["/register", "/login"];

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  // Check if it's a modal intercept (ignoring locale prefix for check)
  const pathnameWithoutLocale = pathname.replace(/^\/(en|vi)/, '');
  const isInterceptPath = intercepts.includes(pathnameWithoutLocale.toLowerCase());

  if (
    isInterceptPath &&
    searchParams.get("_modal") == "0" &&
    request.headers.get("next-url") != null
  ) {
    const cookie = request.headers.get("cookie") || "";
    const headers = new Headers();
    headers.append("rsc", "1");
    headers.append("cookie", cookie);

    return NextResponse.rewrite(new URL(request.url.replace("_modal=0", "")), {
      request: {
        headers,
      },
    });
  }

  return intlMiddleware(request);
}

export const config = {
  // Match only internationalized pathnames
  matcher: ['/', '/(vi|en)/:path*', '/((?!api|_next|_vercel|.*\\..*).*)']
};
