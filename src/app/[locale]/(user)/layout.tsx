"use client";

import { Auth } from "@/components/common";
import { Button } from "@/components/ui/button";
import { Logo } from "@/app/[locale]/(public)/_components/logo";
import { NavMenu } from "@/app/[locale]/(public)/_components/nav-menu";
import { NavigationSheet } from "@/app/[locale]/(public)/_components/navigation-sheet";
import { useAuth } from "@/hooks/use-auth";
import { getDeviceId } from "@/lib/device";
import { useRouter } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { GithubIcon } from "lucide-react";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const { data, logout } = useAuth();

  return (
    <Auth>
      <div className="min-h-screen text-foreground">
        <nav className="sticky top-4 z-50">
          <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-10">
            <div className="glass-panel-strong flex items-center justify-between rounded-full px-4 py-3 shadow-lg">
              <div className="flex items-center gap-6">
                <Logo />
                <NavMenu className="hidden lg:block" />
              </div>

              <div className="flex items-center gap-3">
                {data ? (
                  <>
                    <span className="text-xs text-muted-foreground hidden xl:block">
                      {data.email}
                    </span>
                    <Button
                      variant="outline"
                      className="border-white/10 bg-white/5 text-foreground hover:bg-white/10"
                      onClick={async () =>
                        await logout({ deviceId: getDeviceId() })
                      }
                    >
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      className="border-white/10 bg-white/5 text-foreground hover:bg-white/10"
                      onClick={() => router.push("/login")}
                    >
                      Sign In
                    </Button>
                    <Button
                      className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-emerald-500/20"
                      onClick={() => router.push("/register")}
                    >
                      Sign Up
                    </Button>
                  </>
                )}
                <div className="lg:hidden">
                  <NavigationSheet />
                </div>
              </div>
            </div>
          </div>
        </nav>
        <main className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-10 pb-16 pt-6">
          {children}
        </main>
        <footer className="mt-10">
          <Separator className="opacity-30" />
          <div className="flex sm:flex-row items-center justify-between gap-x-2 gap-y-5 p-6 text-sm max-w-screen-2xl mx-auto">
            <span className="text-muted-foreground">
              &copy; {new Date().getFullYear()} <Link href="/">Netflex Company</Link>. All rights reserved.
            </span>
            <div className="flex items-center gap-5 text-muted-foreground">
              <Link
                href="https://github.com/ngoxuanbac/netflex-client"
                target="_blank"
              >
                <GithubIcon className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </Auth>
  );
}
