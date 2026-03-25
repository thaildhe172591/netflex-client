"use client";

import { useLocale, useTranslations } from "next-intl";
import { routing, usePathname, useRouter } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { useParams } from "next/navigation";
import { useTransition } from "react";

export function LanguageSwitcher() {
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();
    const [isPending, startTransition] = useTransition();

    function onSelectChange(nextLocale: string) {
        startTransition(() => {
            router.replace(pathname, { locale: nextLocale });
        });
    }

    return (
        <div className="flex items-center gap-1 bg-white/5 backdrop-blur-md rounded-full p-1 ring-1 ring-white/10">
            {routing.locales.map((cur) => (
                <button
                    key={cur}
                    onClick={() => onSelectChange(cur)}
                    disabled={isPending}
                    className={cn(
                        "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest transition-all",
                        locale === cur
                            ? "bg-[#10B981] text-black shadow-[0_0_15px_rgba(16,185,129,0.4)]"
                            : "text-white/40 hover:text-white/80 hover:bg-white/5"
                    )}
                >
                    {cur}
                </button>
            ))}
        </div>
    );
}
