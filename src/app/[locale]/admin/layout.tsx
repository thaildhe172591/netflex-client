"use client";

import { Auth } from "@/components/common";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Roles } from "@/constants";
import { AppSidebar } from "./_components/app-sidebar";
import { Separator } from "@radix-ui/react-separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const t = useTranslations("Admin");
  const pathname = usePathname();
  // Remove locale prefix from pathname for breadcrumb calculation if needed
  // But here we can just use the segments
  const pathSegments = pathname.split("/").filter(Boolean);

  const breadcrumbs = pathSegments.map((segment: string, index: number) => {
    const href = "/" + pathSegments.slice(0, index + 1).join("/");

    let name = segment.charAt(0).toUpperCase() + segment.slice(1);

    // Map segments to localized names
    if (segment === "admin") name = t("dashboard");
    else if (segment === "movies") name = t("movies");
    else if (segment === "series") name = t("tv_series");
    else if (segment === "actors") name = t("actors");
    else if (segment === "genres") name = t("genres");
    else if (segment === "users") name = t("users");
    else if (segment === "report") name = t("report");
    else if (segment === "notification") name = t("notification");

    const isLast = index === pathSegments.length - 1;

    return { href, name, isLast };
  });

  return (
    <Auth roles={[Roles.ADMIN, Roles.MODERATOR]}>
      <div className="min-h-screen">
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
            <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
              <div className="flex items-center gap-2 px-4">
                <SidebarTrigger className="-ml-1" />
                <Separator
                  orientation="vertical"
                  className="mr-2 data-[orientation=vertical]:h-4"
                />
                <Breadcrumb>
                  <BreadcrumbList>
                    {breadcrumbs.map(
                      (crumb: {
                        href: string;
                        name: string;
                        isLast: boolean;
                      }) => (
                        <div
                          key={crumb.name}
                          className="flex items-center gap-1.5 sm:gap-2.5"
                        >
                          <BreadcrumbItem key={crumb.name}>
                            {crumb.isLast ? (
                              <BreadcrumbPage>{crumb.name}</BreadcrumbPage>
                            ) : (
                              <BreadcrumbLink href={crumb.href}>
                                {crumb.name}
                              </BreadcrumbLink>
                            )}
                          </BreadcrumbItem>
                          {!crumb.isLast && <BreadcrumbSeparator />}
                        </div>
                      )
                    )}
                  </BreadcrumbList>
                </Breadcrumb>
              </div>
            </header>
            <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
              {children}
            </div>
          </SidebarInset>
        </SidebarProvider>
      </div>
    </Auth>
  );
}
