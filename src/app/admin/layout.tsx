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

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const pathSegments = pathname.split("/").filter(Boolean);

  const breadcrumbs = pathSegments.map((segment: string, index: number) => {
    const href = "/" + pathSegments.slice(0, index + 1).join("/");
    const name =
      segment === "admin"
        ? "Dashboard"
        : segment.charAt(0).toUpperCase() + segment.slice(1);
    const isLast = index === pathSegments.length - 1;

    return { href, name, isLast };
  });

  return (
    <Auth roles={[Roles.ADMIN, Roles.MODERATOR, Roles.USER]}>
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
