"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useLoadingStore } from "@/stores/loading-store";

export function RouteLoadingListener() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const startRouteLoading = useLoadingStore((state) => state.startRouteLoading);
  const stopRouteLoading = useLoadingStore((state) => state.stopRouteLoading);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (event.defaultPrevented) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const target = event.target as HTMLElement | null;
      const anchor = target?.closest("a[href]") as HTMLAnchorElement | null;
      if (!anchor) return;
      if (anchor.target === "_blank") return;
      if (anchor.hasAttribute("download")) return;

      const href = anchor.getAttribute("href");
      if (!href || href.startsWith("#")) return;

      const url = new URL(anchor.href, window.location.origin);
      if (url.origin !== window.location.origin) return;
      if (url.pathname === window.location.pathname && url.search === window.location.search) {
        return;
      }

      startRouteLoading();
    };

    document.addEventListener("click", handleClick, true);
    return () => {
      document.removeEventListener("click", handleClick, true);
    };
  }, [startRouteLoading]);

  useEffect(() => {
    // Route committed => stop progress bar.
    const timer = window.setTimeout(() => {
      stopRouteLoading();
    }, 160);

    return () => {
      window.clearTimeout(timer);
    };
  }, [pathname, searchParams, stopRouteLoading]);

  return null;
}
