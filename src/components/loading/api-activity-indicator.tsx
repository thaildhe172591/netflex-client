"use client";

import { Loader2 } from "lucide-react";
import { useLoadingStore } from "@/stores/loading-store";

export function ApiActivityIndicator() {
  const apiInFlight = useLoadingStore((state) => state.apiInFlight);

  if (apiInFlight <= 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[90] flex items-center gap-2 rounded-full border border-white/10 bg-black/65 px-3 py-1.5 text-xs text-white">
      <Loader2 className="h-3.5 w-3.5 animate-spin" />
      {apiInFlight > 1 ? `Syncing ${apiInFlight} requests` : "Syncing request"}
    </div>
  );
}
