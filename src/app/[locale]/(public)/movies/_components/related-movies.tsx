"use client";

import { useMovies } from "@/hooks/movie/use-movies";
import { Movie } from "@/models/movie";
import { Genre } from "@/models/genre";
import { cn } from "@/lib/utils";
import { MovieCard } from "@/app/[locale]/(public)/movies/_components/movie-card";
import { MovieCardSkeleton } from "@/app/[locale]/(public)/movies/_components/movie-card-skeleton";
import { MediaRail } from "@/app/[locale]/(public)/_components/media-rail";
import { useTranslations } from "next-intl";

interface IProps {
  currentMovieId: string | number;
  genres: Genre[];
  className?: string;
}

export function RelatedMovies({ currentMovieId, genres, className }: IProps) {
  const t = useTranslations("MovieDetail");
  const { data: relatedMoviesData, isLoading } = useMovies({
    genres: genres.map((g) => g.id),
    pageSize: 20,
  });

  const relatedMovies =
    relatedMoviesData?.data?.filter(
      (movie: Movie) => movie.id !== currentMovieId
    ) || [];

  if (isLoading) {
    return (
      <div className={cn("space-y-2 mt-4", className)}>
        <h2 className="m-0 text-sm font-semibold text-muted-foreground">
          {t("related_movies")}
        </h2>
        <div className="flex gap-4 overflow-hidden">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="w-[140px] sm:w-[160px] md:w-[180px] lg:w-[200px] flex-none">
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
    <div className={cn("mt-4", className)}>
      <MediaRail title={t("related_movies")}>
        {relatedMovies.map((movie: Movie) => (
          <div key={movie.id} className="w-[140px] sm:w-[160px] md:w-[180px] lg:w-[200px] flex-none">
            <MovieCard movie={movie} />
          </div>
        ))}
      </MediaRail>
    </div>
  );
}
