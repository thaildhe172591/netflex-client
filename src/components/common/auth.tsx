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
    const pathname = window.location.pathname;
    if (!info?.email && pathname !== "/login" && error) {
      const query = new URLSearchParams({
        callback: pathname,
        error: "Please log in to access this page",
        _modal: "0",
      });
      redirect(`/login?${query.toString()}`);
    }
    if (
      info?.email &&
      pathname !== "/confirm-email" &&
      info?.confirmed === false
    ) {
      const query = new URLSearchParams({
        callback: pathname,
        email: info.email,
      });
      redirect(`/confirm-email?${query.toString()}`);
    }
    if (!info?.email) return;
    const normalizedRoles = (info?.roles || []).map((role) =>
      role.toUpperCase()
    );
    const normalizedPermissions = (info?.permission || []).map((permission) =>
      permission.toUpperCase()
    );
    const hasRole = roles?.length
      ? roles.some((role) => normalizedRoles.includes(role.toUpperCase()))
      : true;
    const hasPermission = permissions?.length
      ? permissions.some((permission) =>
          normalizedPermissions.includes(permission.toUpperCase())
        )
      : true;
    if (!hasRole || !hasPermission) {
      forbidden();
    }
  }, [info, error, isFetchedAfterMount, roles, permissions]);

  if (!info?.email)
    return (
      <div className="flex items-center justify-center">
        <Icons.spinner className="animate-spin" />
      </div>
    );
  return <>{children}</>;
};
