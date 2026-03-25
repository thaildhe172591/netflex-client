"use client";

import { useCallback, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

interface IProps {
  selected?: string;
  onSelect?: (sortBy: string) => void;
}

export function SortBy({ selected = "", onSelect }: IProps) {
  const t = useTranslations("Discover");
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const sortOptions = [
    { value: "", label: t("sort_options.newest") },
    { value: "averageRating.desc", label: t("sort_options.popular") },
    { value: "title.asc", label: t("sort_options.alphabetical") },
  ];

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
      const walk = (x - startX) * 2;
      containerRef.current.scrollLeft = scrollLeft - walk;
    },
    [isDragging, startX, scrollLeft]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleSortClick = (sortBy: string) => {
    if (isDragging) return;
    onSelect?.(sortBy);
  };

  return (
    <div className="relative">
      <div
        ref={containerRef}
        className="edge-fade flex gap-2 overflow-x-auto whitespace-nowrap py-1 scrollbar-hide select-none"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {sortOptions.map((option) => (
          <Button
            key={option.value}
            variant="outline"
            size="sm"
            className={cn(
              "h-9 border-white/10 bg-white/5 text-foreground/80 hover:bg-white/10",
              selected === option.value &&
              "border-primary/40 bg-primary/20 text-foreground shadow-[0_0_16px_rgba(34,197,94,0.35)]"
            )}
            onClick={() => handleSortClick(option.value)}
          >
            {option.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
