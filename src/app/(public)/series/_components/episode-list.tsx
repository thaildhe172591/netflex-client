"use client";

import { useCallback, useRef, useState, useEffect, useMemo } from "react";
import { useEpisodesInfinite } from "@/hooks/episode/use-episodes-infinite";
import { Episode } from "@/models/episode";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { generateSlug } from "@/lib/slug";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { EpisodeCard } from "./episode-card";
import { EpisodeCardSkeleton } from "./episode-card-skeleton";

interface EpisodeListProps {
  serieId: number;
  serieSlug: string;
  selectedEpisodeId?: number;
  className?: string;
}

export function EpisodeList({
  serieId,
  serieSlug,
  selectedEpisodeId,
  className,
}: EpisodeListProps) {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const selectedEpisodeRef = useRef<HTMLDivElement>(null);
  const loadMoreTriggerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useEpisodesInfinite({
      seriesId: serieId,
      pageSize: 10,
    });

  const episodes = useMemo(
    () => data?.pages.flatMap((page) => page.data) || [],
    [data]
  );

  const checkScrollState = useCallback(() => {
    if (!containerRef.current) return;

    const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
  }, []);

  useEffect(() => {
    checkScrollState();
  }, [episodes, checkScrollState]);

  useEffect(() => {
    if (selectedEpisodeRef.current && selectedEpisodeId) {
      selectedEpisodeRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  }, [selectedEpisodeId, episodes]);

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
  }, [fetchNextPage, hasNextPage, isFetchingNextPage, episodes.length]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      checkScrollState();
    };

    container.addEventListener("scroll", handleScroll);

    return () => {
      container.removeEventListener("scroll", handleScroll);
    };
  }, [checkScrollState]);

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
      const walk = (x - startX) * 1.5; // Reduced multiplier for smoother scrolling
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
      const walk = (x - startX) * 1.5; // Reduced multiplier for smoother scrolling
      containerRef.current.scrollLeft = scrollLeft - walk;
    },
    [isDragging, startX, scrollLeft]
  );

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  const scrollToDirection = (direction: "left" | "right") => {
    if (!containerRef.current) return;
    const scrollAmount = 300;
    const newScrollLeft =
      containerRef.current.scrollLeft +
      (direction === "left" ? -scrollAmount : scrollAmount);

    containerRef.current.scrollTo({
      left: newScrollLeft,
      behavior: "smooth",
    });

    // Check scroll state after animation completes
    setTimeout(() => {
      checkScrollState();
    }, 300);
  };

  const handleEpisodeClick = (episode: Episode) => {
    if (isDragging) return;
    const episodeSlug = generateSlug(episode.id, episode.name);
    router.push(`/series/${serieSlug}/${episodeSlug}`);
  };

  if (isLoading) {
    return (
      <div className={cn("space-y-3 mt-4", className)}>
        <div className="flex items-center justify-between">
          <h2 className="m-0 font-semibold">Episodes</h2>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0"
              disabled
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0"
              disabled
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
        <div className="flex gap-3 overflow-hidden py-2">
          {Array.from({ length: 6 }).map((_, index) => (
            <EpisodeCardSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }

  if (!episodes || episodes.length === 0) {
    return null;
  }

  return (
    <div className={cn("mt-4", className)}>
      <div className="flex items-center justify-between">
        <h2 className="m-0 text-sm font-semibold">Episodes</h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => scrollToDirection("left")}
            disabled={!canScrollLeft}
            className="h-8 w-8 p-0"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => scrollToDirection("right")}
            disabled={!canScrollRight}
            className="h-8 w-8 p-0"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div
        ref={containerRef}
        className="flex gap-3 overflow-x-auto scrollbar-hide select-none py-2 min-w-0"
        style={{ touchAction: "pan-x" }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {episodes.map((episode: Episode) => {
          const isSelected = episode.id === selectedEpisodeId;
          return (
            <div
              key={episode.id}
              className="flex-shrink-0"
              ref={isSelected ? selectedEpisodeRef : undefined}
            >
              <EpisodeCard
                episode={episode}
                isSelected={isSelected}
                isDragging={isDragging}
                onClick={handleEpisodeClick}
              />
            </div>
          );
        })}

        {hasNextPage && (
          <div ref={loadMoreTriggerRef} className="flex-shrink-0">
            {isFetchingNextPage ? (
              <EpisodeCardSkeleton />
            ) : (
              <div className="flex items-center justify-center px-4 flex-shrink-0 min-w-[100px]">
                <div className="w-4 h-4 opacity-0"></div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
