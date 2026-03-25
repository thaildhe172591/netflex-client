"use client";

import { useMovies } from "@/hooks/movie/use-movies";
import { useSeries } from "@/hooks/serie/use-series";
import { MovieCard } from "./movies/_components/movie-card";
import { SerieCard } from "./series/_components/serie-card";
import { MovieCardSkeleton } from "./movies/_components/movie-card-skeleton";
import { SerieCardSkeleton } from "./series/_components/serie-card-skeleton";
import { HeroCarousel } from "./_components/hero-carousel";
import { MediaRail } from "./_components/media-rail";
import { Top10Card } from "./_components/top-10-card";
import { AnimeSection } from "./_components/anime-section";
import { CommunitySection } from "./_components/community-section";
import { CinemaCard } from "./_components/cinema-card";
import { Film, Sparkles, Star } from "lucide-react";
import { StaggerGridItem } from "@/components/feedback/stagger-grid-item";
import { useMemo } from "react";
import { useTranslations } from "next-intl";

export default function HomePage() {
  const t = useTranslations("Home");
  const { data: moviesData, isLoading: moviesLoading } = useMovies({
    sortby: "averageRating.desc",
    pageSize: 20,
  });

  const { data: seriesData, isLoading: seriesLoading } = useSeries({
    sortBy: "averageRating.desc",
    pageSize: 20,
  });

  const movies = Array.isArray(moviesData?.data) ? moviesData.data : [];
  const series = Array.isArray(seriesData?.data) ? seriesData.data : [];

  // Simulate different categories natively from fetched movies for demo
  const continueWatching = useMemo(() => movies.slice(0, 10), [movies]);
  const trendingNow = useMemo(() => movies.slice(5, 13), [movies]); // 8 movies for Grid
  const top10Movies = useMemo(() => movies.slice(0, 10), [movies]);

  return (
    <div className="space-y-12">
      <HeroCarousel items={movies} />

      {/* 1. Continue Watching (Rail) */}
      <MediaRail
        title={t("continue_watching")}
        subtitle={t("continue_watching_sub")}
        href="/movies"
        actionLabel={t("view_library")}
      >
        {moviesLoading
          ? Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="w-[140px] sm:w-[160px] md:w-[180px] lg:w-[200px] flex-none">
              <MovieCardSkeleton />
            </div>
          ))
          : continueWatching.map((movie, index) => (
            <div key={movie.id} className="w-[140px] sm:w-[160px] md:w-[180px] lg:w-[200px] flex-none">
              <StaggerGridItem index={index}>
                <MovieCard movie={movie} />
              </StaggerGridItem>
            </div>
          ))}
      </MediaRail>

      {/* 2. Top 10 Movies Today (Rail with Special Card) */}
      {top10Movies.length > 0 && (
        <MediaRail
          title={t("top_10")}
          subtitle={t("top_10_sub")}
        >
          {moviesLoading
            ? Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="w-[200px] sm:w-[240px] md:w-[280px] flex-none">
                <div className="aspect-[16/9] animate-pulse rounded-xl bg-white/5" />
              </div>
            ))
            : top10Movies.map((movie, index) => (
              <div key={movie.id} className="flex-none">
                <StaggerGridItem index={index}>
                  <Top10Card movie={movie} rank={index + 1} />
                </StaggerGridItem>
              </div>
            ))}
        </MediaRail>
      )}

      {/* 3. Trending Now (Grid Layout instead of Rail) */}
      <section className="space-y-4 px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between">
          <div className="space-y-1">
            <h2 className="text-xl md:text-2xl font-bold font-display tracking-tight text-foreground">
              {t("trending")}
            </h2>
            <p className="text-sm text-muted-foreground">
              {t("trending_sub")}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
          {moviesLoading
            ? Array.from({ length: 8 }).map((_, index) => (
              <MovieCardSkeleton key={index} />
            ))
            : trendingNow.map((movie, index) => (
              <StaggerGridItem key={movie.id} index={index}>
                <MovieCard movie={movie} />
              </StaggerGridItem>
            ))}
        </div>
      </section>

      {/* 4. Mãn Nhãn với Phim Chiếu Rạp */}
      <MediaRail
        title={t("cinema")}
        subtitle={t("cinema_sub")}
        href="/movies"
        actionLabel={t("find_cinema")}
      >
        {moviesLoading
          ? Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="w-[280px] sm:w-[340px] md:w-[400px] flex-none">
              <div className="aspect-[16/9] md:aspect-[2/1] bg-white/5 animate-pulse rounded-xl" />
            </div>
          ))
          : movies.slice(6, 16).map((movie, index) => (
            <div key={movie.id} className="flex-none">
              <StaggerGridItem index={index}>
                <CinemaCard movie={movie} />
              </StaggerGridItem>
            </div>
          ))}
      </MediaRail>

      {/* 5. Top TV Series */}
      <MediaRail
        title={t("top_series")}
        subtitle={t("top_series_sub")}
        href="/series"
        actionLabel={t("discover")}
      >
        {seriesLoading
          ? Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="w-[140px] sm:w-[160px] md:w-[180px] lg:w-[200px] flex-none">
              <SerieCardSkeleton />
            </div>
          ))
          : series.map((serie, index) => (
            <div key={serie.id} className="w-[140px] sm:w-[160px] md:w-[180px] lg:w-[200px] flex-none">
              <StaggerGridItem index={index}>
                <SerieCard serie={serie} />
              </StaggerGridItem>
            </div>
          ))}
      </MediaRail>

      {/* 6. Anime Section */}
      <AnimeSection />

      {/* 7. Community Section */}
      <CommunitySection />

      {/* Quality Badge Section */}
      <section className="glass-panel-strong rounded-3xl p-6 md:p-10 mx-4 sm:mx-6 lg:mx-8 mb-12">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="flex flex-col gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-primary">
              <Film className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold font-display">{t("quality_cinema")}</h3>
            <p className="text-sm text-muted-foreground">
              {t("quality_cinema_desc")}
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-primary">
              <Star className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold font-display">{t("curated_collections")}</h3>
            <p className="text-sm text-muted-foreground">
              {t("curated_collections_desc")}
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-primary">
              <Sparkles className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold font-display">{t("seamless_sync")}</h3>
            <p className="text-sm text-muted-foreground">
              {t("seamless_sync_desc")}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
