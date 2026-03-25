"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

export function ScrollToTop() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const toggleVisibility = () => {
            if (window.scrollY > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener("scroll", toggleVisibility);
        return () => window.removeEventListener("scroll", toggleVisibility);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    if (!isVisible) return null;

    return (
        <button
            onClick={scrollToTop}
            className={cn(
                "fixed bottom-8 right-8 z-50 flex h-14 w-14 flex-col items-center justify-center rounded-2xl bg-white text-black shadow-xl transition-all duration-300 hover:scale-105 hover:bg-gray-100 hover:shadow-2xl active:scale-95"
            )}
            aria-label="Cuộn lên đầu trang"
        >
            <ArrowUp className="mb-0.5 h-5 w-5 stroke-[2.5]" />
            <span className="text-[9px] font-bold tracking-wider uppercase">Đầu trang</span>
        </button>
    );
}
