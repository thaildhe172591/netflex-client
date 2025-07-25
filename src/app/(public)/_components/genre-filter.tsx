"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { useGenresInfinite } from "@/hooks/genre/use-genres-infinite";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Icons } from "@/components/common";

interface IProps {
  selected?: number[];
  onSelect?: (genreId: number) => void;
  onClear?: () => void;
}

export function GenreFilter({ selected = [], onSelect, onClear }: IProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const loadMoreTriggerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useGenresInfinite({
      pageSize: 10,
    });

  const genres = data?.pages.flatMap((page) => page.data) || [];

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
      const walk = (x - startX) * 1.5; // Giảm sensitivity để đồng nhất với touch
      containerRef.current.scrollLeft = scrollLeft - walk;
    },
    [isDragging, startX, scrollLeft]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    const loadMoreTrigger = loadMoreTriggerRef.current;
    if (!loadMoreTrigger || !hasNextPage || isFetchingNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
          }
        });
      },
      {
        root: containerRef.current,
        rootMargin: "100px",
        threshold: 0.1,
      }
    );

    observer.observe(loadMoreTrigger);

    return () => {
      observer.disconnect();
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage, genres.length]);

  const handleGenreClick = (genreId: number) => {
    if (isDragging) return;
    onSelect?.(genreId);
  };

  if (isLoading) {
    return (
      <div className="flex gap-2 overflow-x-auto whitespace-nowrap py-1 scrollbar-hide">
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="h-8 w-16 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse flex-shrink-0"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="relative">
      <Button
        variant={selected.length === 0 ? "outline" : "secondary"}
        size="sm"
        className={cn(
          "absolute left-0 top-1 z-10 transition-all flex-shrink-0 border border-border shadow-sm",
          "hover:bg-background"
        )}
        onClick={onClear}
      >
        All Genres
      </Button>

      <div
        ref={containerRef}
        className="flex gap-2 pl-[6.4rem] overflow-x-auto whitespace-nowrap py-1 scrollbar-hide select-none touch-pan-x"
        style={{ touchAction: "pan-x" }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {genres.map((genre) => (
          <Button
            key={genre.id}
            variant={selected.includes(genre.id) ? "outline" : "secondary"}
            size="sm"
            className={cn("border border-border hover:bg-background")}
            onClick={() => handleGenreClick(genre.id)}
          >
            {genre.name}
          </Button>
        ))}

        {hasNextPage && (
          <div
            ref={loadMoreTriggerRef}
            className="flex items-center justify-center px-4 flex-shrink-0"
          >
            {isFetchingNextPage ? (
              <Icons.spinner className="animate-spin !size-4" />
            ) : (
              <div className="w-4 h-4 opacity-0"></div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
