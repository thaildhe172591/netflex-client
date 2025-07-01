"use client";

import { useAuth } from "@/hooks";
import { useEffect } from "react";
import { forbidden, redirect } from "next/navigation";
import { Icons } from "./icon";

export interface AuthProps {
  children: React.ReactNode;
  roles?: Readonly<string[]>;
  permissions?: string[];
}

export const Auth = ({ children, roles, permissions }: AuthProps) => {
  const { data: info, error, isFetchedAfterMount } = useAuth();

  useEffect(() => {
    if (!isFetchedAfterMount) return;
    const callback = encodeURIComponent(
      `${window.location.pathname}${window.location.search}`
    );
    if (!info?.email && error) {
      redirect(
        `/login?callback=${callback}&error=${encodeURIComponent(
          "Please log in to access this page"
        )}`
      );
    }
    if (info?.email && info?.confirmed === false) {
      redirect(`/confirm-email?email=${info.email}&callback=${callback}`);
    }
    if (!info?.email) return;
    const hasRole = roles?.length
      ? roles.some((role) => info?.roles?.includes(role))
      : true;
    const hasPermission = permissions?.length
      ? permissions.some((permission) => info?.permission?.includes(permission))
      : true;
    if (!hasRole || !hasPermission) {
      forbidden();
    }
  }, [info, error, isFetchedAfterMount, roles, permissions]);

  if (!info?.email)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Icons.spinner className="animate-spin" />
      </div>
    );
  return <>{children}</>;
};
