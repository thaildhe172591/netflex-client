"use client";

import { Auth } from "@/components/common";
import { useAuth } from "@/hooks";
import { getDeviceId } from "@/lib/device";
import Link from "next/link";

export default function Home() {
  const { data: info, logout } = useAuth();
  return (
    <Auth>
      <p>Hello World</p>
      <p>{info?.email}</p>
      <button onClick={async () => await logout({ deviceId: getDeviceId() })}>
        Logout
      </button>
      <Link href="/login?_modal=1">Login</Link>
      <Link href="/register?_modal=1">Register</Link>
    </Auth>
  );
}
