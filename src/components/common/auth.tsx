"use client";

import { useAuth } from "@/hooks";
import { useEffect } from "react";
import { forbidden, redirect } from "next/navigation";
import axios from "axios";
import { Icons } from "./icon";

export interface AuthProps {
  children: React.ReactNode;
  roles?: string[];
  permissions?: string[];
}

export const Auth = ({ children, roles, permissions }: AuthProps) => {
  const { data: info, error, isFetched } = useAuth();

  useEffect(() => {
    if (!isFetched) return;
    const callback = encodeURIComponent(
      `${window.location.pathname}${window.location.search}`
    );
    if (axios.isAxiosError(error) && error.response?.status === 302) {
      redirect(`${error.response.data.target}&callback=${callback}`);
    }
    if (!info?.email && error) {
      redirect(
        `/login?callback=${callback}&error=${encodeURIComponent(
          "Please log in to access this page"
        )}`
      );
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
  }, [info, error, isFetched, roles, permissions]);

  if (!info?.email)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Icons.spinner className="animate-spin" />
      </div>
    );
  return <>{children}</>;
};
