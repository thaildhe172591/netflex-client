"use client";

import * as React from "react";
import {
  BarChart3,
  Bell,
  BookUser,
  Film,
  Monitor,
  Tags,
  Users,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { NavItems } from "./nav-items";
import { NavUser } from "./nav-user";
import Link from "next/link";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Icons } from "@/components/common";
import { useAuth } from "@/hooks";
import { useTranslations } from "next-intl";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const t = useTranslations("Admin");
  const { data: user } = useAuth();

  const navHome = [
    {
      title: t("movies"),
      url: "/admin/movies",
      icon: Film,
      isActive: true,
    },
    {
      title: t("tv_series"),
      url: "/admin/series",
      icon: Monitor,
    },
    {
      title: t("actors"),
      url: "/admin/actors",
      icon: Users,
    },
    {
      title: t("genres"),
      url: "/admin/genres",
      icon: Tags,
    },
  ];

  const navUser = [
    {
      title: t("users"),
      url: "/admin/users",
      icon: BookUser,
    },
    {
      title: t("report"),
      url: "/admin/report",
      icon: BarChart3,
    },
    {
      title: t("notification"),
      url: "/admin/notification",
      icon: Bell,
    },
  ];

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/admin">
                <Icons.logo className="!size-4" />
                <span className="text-sm font-semibold">NETFLEX</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <ScrollArea className="h-full">
          <NavItems label={t("content")} items={navHome} />
          <NavItems label={t("system")} items={navUser} />
        </ScrollArea>
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
