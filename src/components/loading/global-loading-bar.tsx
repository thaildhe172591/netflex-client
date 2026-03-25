"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useLoadingStore } from "@/stores/loading-store";

export function GlobalLoadingBar() {
  const routeLoading = useLoadingStore((state) => state.routeLoading);
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let timer: number | undefined;

    if (routeLoading) {
      setVisible(true);
      setProgress(12);

      timer = window.setInterval(() => {
        setProgress((value) => (value < 90 ? value + (100 - value) * 0.08 : value));
      }, 160);
    } else {
      setProgress(100);
      const doneTimer = window.setTimeout(() => {
        setVisible(false);
        setProgress(0);
      }, 220);

      return () => {
        window.clearTimeout(doneTimer);
      };
    }

    return () => {
      if (timer) window.clearInterval(timer);
    };
  }, [routeLoading]);

  return (
    <div
      className={cn(
        "pointer-events-none fixed left-0 right-0 top-0 z-[100] h-[3px] transition-opacity duration-200",
        visible ? "opacity-100" : "opacity-0"
      )}
      aria-hidden="true"
    >
      <div
        className="h-full bg-primary shadow-[0_0_20px_rgba(225,29,72,0.85)] transition-[width] duration-200"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
