"use client";

import { Auth } from "@/components/common";
import { useAuth } from "@/hooks";
import { getDeviceId } from "@/lib/device";
import Link from "next/link";

export default function HomePage() {
  const { data: info, logout } = useAuth();
  return (
    <Auth>
      <p>Hello World</p>
      <p>{info?.email}</p>
      <button onClick={async () => await logout({ deviceId: getDeviceId() })}>
        Logout
      </button>
      <Link href="/login">Login</Link>
      <Link href="/register">Register</Link>
    </Auth>
  );
}
