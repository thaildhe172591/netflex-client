"use client";

import { useCallback, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface IProps {
  selected?: string;
  onSelect?: (year: string) => void;
  onClear?: () => void;
}

export function YearFilter({ selected = "", onSelect, onClear }: IProps) {
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
      const walk = (x - startX) * 2;
      containerRef.current.scrollLeft = scrollLeft - walk;
    },
    [isDragging, startX, scrollLeft]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (!containerRef.current) return;
    setIsDragging(true);
    setStartX(e.touches[0].pageX - containerRef.current.offsetLeft);
    setScrollLeft(containerRef.current.scrollLeft);
  }, []);

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!isDragging || !containerRef.current) return;
      const x = e.touches[0].pageX - containerRef.current.offsetLeft;
      const walk = (x - startX) * 2;
      containerRef.current.scrollLeft = scrollLeft - walk;
    },
    [isDragging, startX, scrollLeft]
  );

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleYearClick = (year: string) => {
    if (isDragging) return;
    onSelect?.(year);
  };

  return (
    <div className="relative">
      <Button
        variant={!selected ? "outline" : "secondary"}
        size="sm"
        className={cn(
          "absolute left-0 top-1 z-10 transition-all flex-shrink-0 border border-border shadow-sm",
          "hover:bg-background"
        )}
        onClick={onClear}
      >
        All Years
      </Button>

      <div
        ref={containerRef}
        className="flex gap-2 pl-[5.5rem] overflow-x-auto whitespace-nowrap py-1 scrollbar-hide select-none"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {years.map((year) => (
          <Button
            key={year}
            variant={selected === year ? "outline" : "secondary"}
            size="sm"
            className={cn("border border-border hover:bg-background")}
            onClick={() => handleYearClick(year)}
          >
            {year}
          </Button>
        ))}
      </div>
    </div>
  );
}
