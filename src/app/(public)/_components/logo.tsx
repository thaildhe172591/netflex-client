import { Icons } from "@/components/common";
import Link from "next/link";

export const Logo = () => (
  <Link className="flex items-center gap-2" href="/">
    <Icons.logo className="!size-4" />
    <span className="text-sm font-semibold">NETFLEX</span>
  </Link>
);
