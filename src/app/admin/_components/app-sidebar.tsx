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

const data = {
  navHome: [
    {
      title: "Movies",
      url: "/admin/movies",
      icon: Film,
      isActive: true,
    },
    {
      title: "TV Series",
      url: "/admin/series",
      icon: Monitor,
    },
    {
      title: "Actors",
      url: "/admin/actors",
      icon: Users,
    },
    {
      title: "Genres",
      url: "/admin/genres",
      icon: Tags,
    },
  ],
  navUser: [
    {
      title: "Users",
      url: "/admin/users",
      icon: BookUser,
    },
    {
      title: "Report",
      url: "/admin/report",
      icon: BarChart3,
    },
    {
      title: "Notification",
      url: "/admin/notification",
      icon: Bell,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: user } = useAuth();
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
          <NavItems label="Content" items={data.navHome} />
          <NavItems label="System" items={data.navUser} />
        </ScrollArea>
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
