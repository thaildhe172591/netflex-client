"use client";

import { notFound } from "next/navigation";
import { useMovieDetail } from "@/hooks/movie/use-movie-detail";
import { useUserReview } from "@/hooks/review/use-user-review";
import { useSubmitReview } from "@/hooks/review/use-submit-review";
import { useAuth } from "@/hooks/use-auth";
import { extractIdFromSlug } from "@/lib/slug";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CinematicPlayer } from "@/components/cinematic-player";
import { FollowButton } from "@/app/[locale]/(public)/_components/follow-button";
import { ReportDialog } from "@/app/[locale]/(public)/_components/report-dialog";
import { ActorCards } from "@/app/[locale]/(public)/_components/actor-cards";
import { RelatedMovies } from "@/app/[locale]/(public)/movies/_components/related-movies";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { StarRating } from "@/components/star-rating";
import { useState, use, useEffect } from "react";
import { Link } from "@/i18n/routing";
import Image from "next/image";
import { Flag, Play } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { QueryKeys } from "@/constants/query-keys";
import { useTranslations } from "next-intl";

interface MovieDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default function MovieDetailPage({ params }: MovieDetailPageProps) {
  const t = useTranslations("MovieDetail");
  const tCommon = useTranslations("Common");
  const { slug } = use(params);
  const movieId = extractIdFromSlug(slug);
  const [userRating, setUserRating] = useState(0);
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);

  if (!movieId) notFound();
  const movieIdValue = movieId as string;

  const auth = useAuth();
  const queryClient = useQueryClient();
  const {
    data: movie,
    isLoading,
    error,
    refetch: refetchMovie,
  } = useMovieDetail(movieIdValue);
  const { data: userReview } = useUserReview({
    targetId: movieIdValue.toString(),
    targetType: "movie",
  });
  const submitReview = useSubmitReview();

  useEffect(() => {
    if (userReview?.rating) {
      setUserRating(userReview.rating);
    } else {
      setUserRating(0);
    }
  }, [userReview]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-[60vh] rounded-3xl border border-white/10 skeleton-shimmer" />
        <div className="h-6 w-1/3 skeleton-shimmer rounded-full" />
        <div className="h-4 w-1/2 skeleton-shimmer rounded-full" />
      </div>
    );
  }
  if (!movie || error) notFound();

  const handleUserRatingChange = async (rating: number) => {
    if (!auth.data) return;
    setUserRating(rating);

    try {
      await submitReview.mutateAsync({
        targetId: movieIdValue.toString(),
        targetType: "movie",
        rating,
      });

      await queryClient.invalidateQueries({
        queryKey: [QueryKeys.MOVIES, movieIdValue],
      });
    } catch {
      setUserRating(userReview?.rating || 0);
    }
  };

  const refreshPlaybackSource = async () => {
    const refreshed = await refetchMovie();
    return refreshed.data?.videoUrl;
  };

  return (
    <div className="space-y-10">
      <section className="relative overflow-hidden rounded-3xl border border-white/10">
        <div className="absolute inset-0">
          <Image
            src={movie.backdropPath || movie.posterPath || "/placeholder.png"}
            alt={movie.title}
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#020617] via-[#020617cc] to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent" />
        </div>

        <div className="relative z-10 p-6 md:p-10">
          <Breadcrumb className="mb-4 text-xs text-muted-foreground">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/">{tCommon("home")}</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/movies">{tCommon("movies")}</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{movie.title}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="grid gap-8 lg:grid-cols-[220px_1fr] items-end">
            <div className="hidden lg:block">
              <div className="glass-panel rounded-2xl overflow-hidden border border-white/10">
                {movie.posterPath ? (
                  <Image
                    src={movie.posterPath}
                    alt={movie.title}
                    width={220}
                    height={320}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-[320px] w-full items-center justify-center text-sm text-muted-foreground">
                    {tCommon("poster_not_available")}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <h1 className="text-3xl md:text-4xl font-display font-semibold text-foreground">
                {movie.title}{" "}
                <span className="text-muted-foreground text-xl font-normal">
                  ({movie.releaseDate && new Date(movie.releaseDate).getFullYear()})
                </span>
              </h1>
              <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                {movie.releaseDate && (
                  <span>
                    {new Date(movie.releaseDate).toLocaleDateString("en-US", {
                      weekday: "short",
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                )}
                <span>•</span>
                <span>{movie.runtime ? `${movie.runtime} min` : tCommon("feature")}</span>
                <span>•</span>
                <span>{movie.countryIso || tCommon("worldwide")}</span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Button
                  asChild
                  className="bg-primary text-primary-foreground shadow-lg shadow-emerald-500/30"
                >
                  <a href="#player">
                    <Play className="h-4 w-4" />
                    {t("watch_now")}
                  </a>
                </Button>
                <FollowButton
                  targetId={movieIdValue.toString()}
                  targetType="movie"
                  className="border-white/10 bg-white/5 text-foreground hover:bg-white/10"
                />
                <Button
                  variant="outline"
                  size="sm"
                  className="border-white/10 bg-white/5 text-foreground hover:bg-white/10"
                  onClick={() => setIsReportDialogOpen(true)}
                >
                  <Flag className="w-4 h-4 mr-2" />
                  {t("report")}
                </Button>
              </div>

              {movie.genres && movie.genres.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {movie.genres.map((genre) => (
                    <Link
                      key={genre.id}
                      href={`/movies?genres=${genre.id}`}
                      className="transition-transform duration-200 hover:scale-[1.02]"
                    >
                      <Badge
                        variant="outline"
                        className="border-white/10 bg-white/5 text-foreground/80 hover:bg-white/10"
                      >
                        {genre.name}
                      </Badge>
                    </Link>
                  ))}
                </div>
              )}

              {movie.overview && (
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {movie.overview}
                </p>
              )}

              <div className="glass-panel rounded-2xl p-4 flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-3">
                  <span className="flex items-center justify-center text-xl font-bold w-12 h-12 rounded-xl bg-white/10">
                    {movie.averageRating?.toFixed(1) || 0}
                  </span>
                  <div>
                    <StarRating
                      rating={userRating}
                      size="lg"
                      interactive={!!auth.data}
                      onRatingChange={handleUserRatingChange}
                    />
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{t("reviews", { count: movie.totalReviews ?? 0 })}</span>
                      {!auth.data && (
                        <Badge className="bg-white/10 text-foreground border-white/10">
                          {t("login_to_rate")}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-6 right-6 hidden lg:flex">
          <Button
            size="icon"
            className="h-14 w-14 rounded-full bg-primary text-primary-foreground shadow-lg shadow-emerald-500/40"
            asChild
          >
            <a href="#player" aria-label="Play">
              <Play className="h-5 w-5" />
            </a>
          </Button>
        </div>
      </section>

      <section id="player" className="space-y-4">
        <h2 className="text-lg font-semibold font-display">{t("player")}</h2>
        {movie.videoUrl ? (
          <CinematicPlayer
            src={movie.videoUrl}
            title={movie.title}
            poster={movie.backdropPath || movie.posterPath}
            className="ambient-glow"
            refreshSource={refreshPlaybackSource}
          />
        ) : (
          <div className="w-full aspect-video rounded-2xl border border-white/10 bg-white/5 flex items-center justify-center">
            <p className="text-muted-foreground">{tCommon("no_video")}</p>
          </div>
        )}
      </section>

      {movie.actors && movie.actors.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold font-display">{t("cast")}</h2>
          <ActorCards actors={movie.actors} />
        </div>
      )}

      {movie.genres && movie.genres.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold font-display">{t("because_watch")}</h2>
          <RelatedMovies currentMovieId={movieIdValue} genres={movie.genres} />
        </div>
      )}

      <ReportDialog
        open={isReportDialogOpen}
        onOpenChange={setIsReportDialogOpen}
        from={`/movies/${slug}`}
        targetTitle={movie.title}
      />
    </div>
  );
}
