"use client";

import { useCallback, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

interface IProps {
  selected?: string;
  onSelect?: (year: string) => void;
  onClear?: () => void;
}

export function YearFilter({ selected = "", onSelect, onClear }: IProps) {
  const t = useTranslations("Discover");
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1980 + 1 }, (_, i) =>
    (currentYear - i).toString()
  );

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!containerRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - containerRef.current.offsetLeft);
    setScrollLeft(containerRef.current.scrollLeft);
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging || !containerRef.current) return;
      e.preventDefault();
      const x = e.pageX - containerRef.current.offsetLeft;
      const walk = (x - startX) * 1.5;
      containerRef.current.scrollLeft = scrollLeft - walk;
    },
    [isDragging, startX, scrollLeft]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleYearClick = (year: string) => {
    if (isDragging) return;
    onSelect?.(year);
  };

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="sm"
        className={cn(
          "absolute left-0 top-1 z-10 h-9 flex-shrink-0 border border-white/10 bg-white/5 text-foreground/80 hover:bg-white/10",
          !selected &&
          "border-primary/40 bg-primary/20 text-foreground shadow-[0_0_16px_rgba(34,197,94,0.35)]"
        )}
        onClick={onClear}
      >
        {t("all_years")}
      </Button>

      <div
        ref={containerRef}
        className="edge-fade flex gap-2 pl-[6.5rem] overflow-x-auto whitespace-nowrap py-1 scrollbar-hide select-none touch-pan-x"
        style={{ touchAction: "pan-x" }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {years.map((year) => (
          <Button
            key={year}
            variant="outline"
            size="sm"
            className={cn(
              "h-9 border-white/10 bg-white/5 text-foreground/80 hover:bg-white/10",
              selected === year &&
              "border-primary/40 bg-primary/20 text-foreground shadow-[0_0_16px_rgba(34,197,94,0.35)]"
            )}
            onClick={() => handleYearClick(year)}
          >
            {year}
          </Button>
        ))}
      </div>
    </div>
  );
}
