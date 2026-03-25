import { Icons } from "@/components/common";
import Link from "next/link";

export const Logo = () => (
  <Link className="flex items-center gap-3" href="/">
    <span className="relative flex h-9 w-9 items-center justify-center rounded-full bg-white/5 border border-white/10 shadow-lg">
      <Icons.logo className="!size-4 text-primary" />
    </span>
    <span className="text-base font-semibold tracking-[0.2em] uppercase text-foreground font-display">
      NETFLEX
    </span>
  </Link>
);
