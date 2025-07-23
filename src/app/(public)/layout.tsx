"use client";
import { Button } from "@/components/ui/button";
import { Logo } from "./_components/logo";
import { NavMenu } from "./_components/nav-menu";
import { NavigationSheet } from "./_components/navigation-sheet";
import { useRouter } from "next/navigation";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-muted">
      <nav className="h-16 bg-background border-b">
        <div className="h-full flex items-center justify-between max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <Logo />
          <NavMenu className="hidden md:block" />
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              className="hidden sm:inline-flex"
              onClick={() => router.push("/login")}
            >
              Sign In
            </Button>
            <Button onClick={() => router.push("/register")}>Sign Up</Button>
            <div className="md:hidden">
              <NavigationSheet />
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-screen-xl mx-auto p-4 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}
