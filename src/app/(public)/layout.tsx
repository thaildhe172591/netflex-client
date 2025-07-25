"use client";
import { Button } from "@/components/ui/button";
import { Logo } from "./_components/logo";
import { NavMenu } from "./_components/nav-menu";
import { NavigationSheet } from "./_components/navigation-sheet";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks";
import { getDeviceId } from "@/lib/device";
import Link from "next/link";
import { GithubIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const { data, logout } = useAuth();

  return (
    <div className="min-h-screen bg-muted">
      <nav className="h-16 bg-background border-b">
        <div className="h-full flex items-center justify-between max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-8">
            <Logo />
            <NavMenu className="hidden md:block" />
          </div>

          <div className="flex items-center gap-3">
            {data ? (
              <>
                <span className="text-sm">{data.email}</span>
                <Button
                  variant="outline"
                  onClick={async () =>
                    await logout({ deviceId: getDeviceId() })
                  }
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" onClick={() => router.push("/login")}>
                  Sign In
                </Button>
                <Button onClick={() => router.push("/register")}>
                  Sign Up
                </Button>
              </>
            )}
            <div className="md:hidden">
              <NavigationSheet />
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-screen-xl mx-auto p-4 sm:px-6 lg:px-8 min-h-screen">
        {children}
      </main>
      <footer>
        <Separator />
        <div className="flex sm:flex-row items-center justify-between gap-x-2 gap-y-5 p-6 text-sm max-w-screen-xl mx-auto">
          <span className="text-muted-foreground">
            &copy; {new Date().getFullYear()}{" "}
            <Link href="/">Netflex Company</Link>. All rights reserved.
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
  );
}
