"use client";
import { Button } from "@/components/ui/button";
import { Logo } from "./_components/logo";
import { NavMenu } from "./_components/nav-menu";
import { NavigationSheet } from "./_components/navigation-sheet";
import { useRouter, usePathname } from "@/i18n/routing";
import { useAuth } from "@/hooks";
import { getDeviceId } from "@/lib/device";
import Link from "next/link";
import { GithubIcon, LogOut, UserRound } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { AnimatePresence, motion } from "framer-motion";
import { appToast } from "@/lib/toast";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollToTop } from "@/components/ui/scroll-to-top";
import { LanguageSwitcher } from "./_components/language-switcher";
import { useTranslations } from "next-intl";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const t = useTranslations("Common");
  const router = useRouter();
  const pathname = usePathname();
  const { data, logout } = useAuth();
  const [isLogoutPending, setIsLogoutPending] = useState(false);
  const displayName = data?.email?.split("@")[0] || t("guest");

  return (
    <div className="min-h-screen text-foreground">
      <nav className="sticky top-4 z-50">
        <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-10">
          <div className="glass-panel-strong flex items-center justify-between rounded-full px-4 py-3 shadow-lg">
            <div className="flex items-center gap-6">
              <Logo />
              <NavMenu className="hidden lg:block" />
            </div>

            <div className="flex items-center gap-3">
              <LanguageSwitcher />

              <AnimatePresence mode="wait" initial={false}>
                {data ? (
                  <motion.div
                    key="auth-user"
                    initial={{ opacity: 0, y: -8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.97 }}
                    transition={{ duration: 0.22, ease: "easeOut" }}
                  >
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          className="border-primary/30 bg-primary/15 text-foreground hover:bg-primary/25"
                        >
                          <UserRound className="h-4 w-4" />
                          <span className="max-w-40 truncate">
                            {displayName}
                          </span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-60">
                        <DropdownMenuLabel className="space-y-1">
                          <p className="text-sm font-semibold">{t("hi", { name: displayName })}</p>
                          <p className="text-xs font-normal text-muted-foreground truncate">
                            {data.email}
                          </p>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => router.push("/setting")}>
                          {t("profile")}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-400 focus:text-red-300"
                          onClick={async () => {
                            const loadingId = appToast.loading({
                              title: t("signing_out"),
                            });
                            setIsLogoutPending(true);
                            try {
                              await logout({ deviceId: getDeviceId() });
                              appToast.success({
                                title: t("signed_out"),
                              });
                            } catch {
                              appToast.error({
                                title: t("sign_out_error"),
                              });
                            } finally {
                              appToast.dismiss(loadingId);
                              setIsLogoutPending(false);
                            }
                          }}
                          disabled={isLogoutPending}
                        >
                          <LogOut className="h-4 w-4" />
                          {isLogoutPending ? t("signing_out") : t("logout")}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </motion.div>
                ) : (
                  <motion.div
                    key="auth-guest"
                    initial={{ opacity: 0, y: -8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.97 }}
                    transition={{ duration: 0.22, ease: "easeOut" }}
                    className="flex items-center gap-3"
                  >
                    <Button
                      variant="outline"
                      className="border-white/10 bg-white/5 text-foreground hover:bg-white/10"
                      onClick={() => router.push("/login")}
                    >
                      {t("signin")}
                    </Button>
                    <Button
                      className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-emerald-500/20"
                      onClick={() => router.push("/register")}
                    >
                      {t("signup")}
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
              <div className="lg:hidden">
                <NavigationSheet />
              </div>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-10 pb-16 pt-6">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
      <footer className="mt-10">
        <Separator className="opacity-30" />
        <div className="flex sm:flex-row items-center justify-between gap-x-2 gap-y-5 p-6 text-sm max-w-screen-2xl mx-auto">
          <span className="text-muted-foreground">
            &copy; {new Date().getFullYear()}{" "}
            <Link href="/" className="text-foreground hover:text-primary">
              Netflex Company
            </Link>
            . {t("all_rights_reserved")}.
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
      <ScrollToTop />
    </div>
  );
}
