import { Suspense } from "react";
import { DynamicBackground } from "./_components/dynamic-background";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen relative flex items-center justify-center p-4">
      <DynamicBackground /> <Suspense>{children}</Suspense>
    </div>
  );
}
