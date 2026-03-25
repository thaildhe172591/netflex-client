"use client";

import { useCallback, useRef, useState } from "react";
import { useCountries } from "@/hooks/country/use-countries";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

interface IProps {
  selected?: string;
  onSelect?: (countryCode: string) => void;
  onClear?: () => void;
}

export function CountryFilter({ selected = "", onSelect, onClear }: IProps) {
  const t = useTranslations("Discover");
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
            className="h-9 w-24 rounded-full border border-white/10 bg-white/5 skeleton-shimmer flex-shrink-0"
          />
        ))}
      </div>
    );
  }

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
        {t("all_countries")}
      </Button>

      <div
        ref={containerRef}
        className="edge-fade flex gap-2 pl-[8.4rem] overflow-x-auto whitespace-nowrap py-1 scrollbar-hide select-none touch-pan-x"
        style={{ touchAction: "pan-x" }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {countries?.map((country) => (
          <Button
            key={country.iso_3166_1}
            variant="outline"
            size="sm"
            className={cn(
              "h-9 border-white/10 bg-white/5 text-foreground/80 hover:bg-white/10",
              selected === country.iso_3166_1 &&
              "border-primary/40 bg-primary/20 text-foreground shadow-[0_0_16px_rgba(34,197,94,0.35)]"
            )}
            onClick={() => handleCountryClick(country.iso_3166_1)}
          >
            {country.english_name}
          </Button>
        ))}
      </div>
    </div>
  );
}
