"use client";

import { useCallback, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface IProps {
  selected?: string;
  onSelect?: (sortBy: string) => void;
}

const sortOptions = [
  { value: "", label: "Newest" },
  { value: "averagerating.desc", label: "Popular" },
  { value: "title.asc", label: "A-Z" },
];

export function SortBy({ selected = "", onSelect }: IProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

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
        className="flex gap-2 overflow-x-auto whitespace-nowrap py-1 scrollbar-hide select-none"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {sortOptions.map((option) => (
          <Button
            key={option.value}
            variant={selected === option.value ? "outline" : "secondary"}
            size="sm"
            className={cn("border border-border hover:bg-background")}
            onClick={() => handleSortClick(option.value)}
          >
            {option.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
