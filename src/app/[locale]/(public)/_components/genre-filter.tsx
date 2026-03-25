"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { useGenresInfinite } from "@/hooks/genre/use-genres-infinite";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Icons } from "@/components/common";
import { useTranslations } from "next-intl";

interface IProps {
  selected?: string[];
  onSelect?: (genreId: string) => void;
  onClear?: () => void;
}

export function GenreFilter({ selected = [], onSelect, onClear }: IProps) {
  const t = useTranslations("Discover");
  const containerRef = useRef<HTMLDivElement>(null);
  const loadMoreTriggerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useGenresInfinite({
      pageSize: 10,
    });

  const genres = (data?.pages.flatMap((page) => page.data) || []).filter(
    (genre): genre is { id: string; name: string } =>
      typeof genre?.name === "string" && genre.name.length > 0
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

  const handleGenreClick = (genreId: string) => {
    if (isDragging) return;
    onSelect?.(genreId);
  };

  if (isLoading) {
    return (
      <div className="flex gap-2 overflow-x-auto whitespace-nowrap py-1 scrollbar-hide">
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="h-9 w-20 rounded-full border border-white/10 bg-white/5 skeleton-shimmer flex-shrink-0"
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
          selected.length === 0 &&
          "border-primary/40 bg-primary/20 text-foreground shadow-[0_0_16px_rgba(34,197,94,0.35)]"
        )}
        onClick={onClear}
      >
        {t("all_genres")}
      </Button>

      <div
        ref={containerRef}
        className="edge-fade flex gap-2 pl-[7.8rem] overflow-x-auto whitespace-nowrap py-1 scrollbar-hide select-none touch-pan-x"
        style={{ touchAction: "pan-x" }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {genres.map((genre, index) => (
          <Button
            key={`genre-${genre.id ?? "unknown"}-${index}`}
            variant="outline"
            size="sm"
            className={cn(
              "h-9 border-white/10 bg-white/5 text-foreground/80 hover:bg-white/10",
              typeof genre.id === "string" &&
              selected.includes(genre.id) &&
              "border-primary/40 bg-primary/20 text-foreground shadow-[0_0_16px_rgba(34,197,94,0.35)]"
            )}
            onClick={() => {
              if (typeof genre.id === "string") {
                handleGenreClick(genre.id);
              }
            }}
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
