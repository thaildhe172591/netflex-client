"use client";

import { useCallback, useRef, useState } from "react";
import { useSeries } from "@/hooks/serie/use-series";
import { Serie } from "@/models/serie";
import { Genre } from "@/models/genre";
import { cn } from "@/lib/utils";
import { SerieCard } from "@/app/(public)/series/_components/serie-card";
import { SerieCardSkeleton } from "@/app/(public)/series/_components/serie-card-skeleton";

interface IProps {
  currentSerieId: number;
  genres: Genre[];
  className?: string;
}

export function RelatedSeries({ currentSerieId, genres, className }: IProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const { data: relatedSeriesData, isLoading } = useSeries({
    genres: genres.map((g) => g.id),
    pageSize: 20,
    pageIndex: 1,
  });

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

  const relatedSeries =
    relatedSeriesData?.data?.filter(
      (serie: Serie) => serie.id !== currentSerieId
    ) || [];

  if (isLoading) {
    return (
      <div className={cn("space-y-2 mt-4", className)}>
        <h2 className="m-0 font-semibold">Related Series</h2>
        <div className="flex gap-4 overflow-hidden">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="min-w-[200px]">
              <SerieCardSkeleton />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!relatedSeries || relatedSeries.length === 0) {
    return null;
  }

  return (
    <div className={cn("space-y-2 mt-4", className)}>
      <h2 className="m-0 text-sm font-semibold">Related Series</h2>
      <div
        ref={containerRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide select-none py-2"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {relatedSeries.map((serie: Serie) => (
          <div key={serie.id} className="w-[180px]">
            <SerieCard serie={serie} />
          </div>
        ))}
      </div>
    </div>
  );
}
