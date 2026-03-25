"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ReactNode } from "react";
import { GlobalLoadingBar } from "@/components/loading/global-loading-bar";
import { RouteLoadingListener } from "@/components/loading/route-loading-listener";
import { ApiActivityIndicator } from "@/components/loading/api-activity-indicator";
import { ToastViewport } from "@/components/feedback/toast-viewport";

const queryClient = new QueryClient();

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <RouteLoadingListener />
      <GlobalLoadingBar />
      <ToastViewport />
      <ApiActivityIndicator />
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
