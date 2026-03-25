"use client";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { NavigationMenuProps } from "@radix-ui/react-navigation-menu";
import { cn } from "@/lib/utils";
import { Link, usePathname } from "@/i18n/routing";
import { Roles } from "@/constants";
import { useAuth } from "@/hooks/use-auth";
import { useTranslations } from "next-intl";

const navigationItems = [
  { href: "/", labelKey: "home" },
  { href: "/movies", labelKey: "movies" },
  { href: "/series", labelKey: "series" },
  { href: "/setting", labelKey: "profile" },
  {
    href: "/admin",
    labelKey: "dashboard",
    roles: [Roles.ADMIN, Roles.MODERATOR],
  },
  { href: "/privacy", labelKey: "privacy" },
];

export const NavMenu = (props: NavigationMenuProps) => {
  const t = useTranslations("Common");
  const pathname = usePathname();
  const { data: user } = useAuth();
  const userRoles = (user?.roles || []).map((role) => role.toUpperCase());

  return (
    <NavigationMenu {...props}>
      <NavigationMenuList className="gap-6 space-x-0 data-[orientation=vertical]:flex-col data-[orientation=vertical]:items-start">
        {navigationItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/" && pathname.startsWith(item.href));

          const hasAccess =
            item.roles &&
            user &&
            userRoles.some((role) =>
              item.roles?.map((r) => r.toUpperCase()).includes(role)
            );

          if (item.roles && !hasAccess) return null;

          return (
            <NavigationMenuItem key={item.href}>
              <NavigationMenuLink asChild>
                <Link
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "relative rounded-md px-1 py-0.5 text-sm font-medium tracking-wide text-foreground/70 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
                    isActive
                      ? "text-foreground after:absolute after:-bottom-2 after:left-0 after:h-[2px] after:w-full after:bg-primary after:shadow-[0_0_16px_rgba(34,197,94,0.6)]"
                      : "text-foreground/60"
                  )}
                >
                  {t(item.labelKey as any)}
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          );
        })}
      </NavigationMenuList>
    </NavigationMenu>
  );
};
