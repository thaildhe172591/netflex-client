"use client";

import { useCallback, useRef, useState } from "react";
import { useCountries } from "@/hooks/country/use-countries";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface IProps {
  selected?: string;
  onSelect?: (countryCode: string) => void;
  onClear?: () => void;
}

export function CountryFilter({ selected = "", onSelect, onClear }: IProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const { data: countries, isLoading } = useCountries();

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

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (!containerRef.current) return;
    setIsDragging(true);
    setStartX(e.touches[0].clientX);
    setScrollLeft(containerRef.current.scrollLeft);
  }, []);

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!isDragging || !containerRef.current) return;
      e.preventDefault();
      const x = e.touches[0].clientX;
      const walk = (startX - x) * 1.5;
      containerRef.current.scrollLeft = scrollLeft + walk;
    },
    [isDragging, startX, scrollLeft]
  );

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleCountryClick = (countryCode: string) => {
    if (isDragging) return;
    onSelect?.(countryCode);
  };

  if (isLoading) {
    return (
      <div className="flex gap-2 overflow-x-auto whitespace-nowrap py-1 scrollbar-hide">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="h-8 w-20 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse flex-shrink-0"
          />
        ))}
      </div>
    );
  }

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
        All Countries
      </Button>

      <div
        ref={containerRef}
        className="flex gap-2 pl-[7.4rem] overflow-x-auto whitespace-nowrap py-1 scrollbar-hide select-none touch-pan-x"
        style={{ touchAction: "pan-x" }} // Chỉ cho phép scroll ngang
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {countries?.map((country) => (
          <Button
            key={country.iso_3166_1}
            variant={selected === country.iso_3166_1 ? "outline" : "secondary"}
            size="sm"
            className={cn("border border-border hover:bg-background")}
            onClick={() => handleCountryClick(country.iso_3166_1)}
          >
            {country.english_name}
          </Button>
        ))}
      </div>
    </div>
  );
}
