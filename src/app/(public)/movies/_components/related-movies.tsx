"use client";

import { useCallback, useRef, useState } from "react";
import { useMovies } from "@/hooks/movie/use-movies";
import { Movie } from "@/models/movie";
import { Genre } from "@/models/genre";
import { cn } from "@/lib/utils";
import { MovieCard } from "@/app/(public)/movies/_components/movie-card";
import { MovieCardSkeleton } from "@/app/(public)/movies/_components/movie-card-skeleton";

interface IProps {
  currentMovieId: number;
  genres: Genre[];
  className?: string;
}

export function RelatedMovies({ currentMovieId, genres, className }: IProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const { data: relatedMoviesData, isLoading } = useMovies({
    genres: genres.map((g) => g.id),
    pageSize: 20,
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

  const relatedMovies =
    relatedMoviesData?.data?.filter(
      (movie: Movie) => movie.id !== currentMovieId
    ) || [];

  if (isLoading) {
    return (
      <div className={cn("space-y-2 mt-4", className)}>
        <h2 className="m-0 font-semibold">Related Movies</h2>
        <div className="flex gap-4 overflow-hidden">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="min-w-[180px]">
              <MovieCardSkeleton />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!relatedMovies || relatedMovies.length === 0) {
    return null;
  }

  return (
    <div className={cn("space-y-2  mt-4", className)}>
      <h2 className="m-0 text-sm font-semibold">Related Movies</h2>
      <div
        ref={containerRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide select-none py-2 touch-pan-x"
        style={{ touchAction: "pan-x" }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {relatedMovies.map((movie: Movie) => (
          <div key={movie.id} className="min-w-[180px] flex-shrink-0">
            <MovieCard movie={movie} />
          </div>
        ))}
      </div>
    </div>
  );
}
