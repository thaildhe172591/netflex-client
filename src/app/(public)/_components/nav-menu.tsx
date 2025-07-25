"use client";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { NavigationMenuProps } from "@radix-ui/react-navigation-menu";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Roles } from "@/constants";
import { useAuth } from "@/hooks/use-auth";

const navigationItems = [
  { href: "/", label: "Home" },
  { href: "/movies", label: "Movies" },
  { href: "/series", label: "TV Series" },
  {
    href: "/admin",
    label: "Dashboard",
    roles: [Roles.ADMIN, Roles.MODERATOR],
  },
  { href: "/privacy", label: "Privacy" },
];

export const NavMenu = (props: NavigationMenuProps) => {
  const pathname = usePathname();
  const { data: user } = useAuth();

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
            user.roles.some((role) => item.roles.includes(role));

          if (item.roles && !hasAccess) return null;

          return (
            <NavigationMenuItem key={item.href}>
              <NavigationMenuLink asChild>
                <Link
                  href={item.href}
                  className={cn(
                    "transition-colors hover:text-foreground/80",
                    isActive
                      ? "text-foreground font-medium border-b-2 border-primary rounded-b-none"
                      : "text-foreground/60"
                  )}
                >
                  {item.label}
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          );
        })}
      </NavigationMenuList>
    </NavigationMenu>
  );
};
