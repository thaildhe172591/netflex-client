"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { Logo } from "./logo";
import { Link, usePathname } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

const className =
  "flex items-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 border border-white/10 bg-white/5 hover:bg-white/10 h-11 px-4";

export const NavigationSheet = () => {
  const t = useTranslations("Common");
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const handleClose = () => setOpen(false);
  const activeClass =
    "border-primary/40 bg-primary/20 text-foreground shadow-[0_0_16px_rgba(34,197,94,0.25)]";

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="border-white/10 bg-white/5 hover:bg-white/10"
        >
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent className="glass-panel-strong border-white/10">
        <SheetHeader>
          <SheetTitle>
            <Logo />
          </SheetTitle>
        </SheetHeader>
        <div className="grid flex-1 auto-rows-min gap-3 px-4 mt-6">
          <Link
            href="/"
            className={cn(className, pathname === "/" && activeClass)}
            onClick={handleClose}
            aria-current={pathname === "/" ? "page" : undefined}
          >
            {t("home")}
          </Link>
          <Link
            href="/movies"
            className={cn(className, pathname.startsWith("/movies") && activeClass)}
            onClick={handleClose}
            aria-current={pathname.startsWith("/movies") ? "page" : undefined}
          >
            {t("movies")}
          </Link>
          <Link
            href="/series"
            className={cn(className, pathname.startsWith("/series") && activeClass)}
            onClick={handleClose}
            aria-current={pathname.startsWith("/series") ? "page" : undefined}
          >
            {t("series")}
          </Link>
          <Link
            href="/setting"
            className={cn(className, pathname.startsWith("/setting") && activeClass)}
            onClick={handleClose}
            aria-current={pathname.startsWith("/setting") ? "page" : undefined}
          >
            {t("profile")}
          </Link>
          <Link
            href="/privacy"
            className={cn(className, pathname.startsWith("/privacy") && activeClass)}
            onClick={handleClose}
            aria-current={pathname.startsWith("/privacy") ? "page" : undefined}
          >
            {t("privacy")}
          </Link>
        </div>
      </SheetContent>
    </Sheet>
  );
};
