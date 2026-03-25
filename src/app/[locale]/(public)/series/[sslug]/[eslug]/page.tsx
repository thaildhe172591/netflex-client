"use client";

import { notFound } from "next/navigation";
import { useEpisodeDetail } from "@/hooks/episode/use-episode-detail";
import { useEpisodes } from "@/hooks/episode/use-episodes";
import { useSerieDetail } from "@/hooks/serie/use-serie-detail";
import { extractIdFromSlug } from "@/lib/slug";
import { use, useEffect, useRef, useState, useCallback } from "react";
import { useWatchHistory } from "@/app/[locale]/(public)/series/_hooks/use-watch-history";
import { useUserReview } from "@/hooks/review/use-user-review";
import { useSubmitReview } from "@/hooks/review/use-submit-review";
import { useAuth } from "@/hooks/use-auth";
import { useQueryClient } from "@tanstack/react-query";
import { QueryKeys } from "@/constants/query-keys";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CinematicPlayer } from "@/components/cinematic-player";
import { FollowButton } from "@/app/[locale]/(public)/_components/follow-button";
import { ReportDialog } from "@/app/[locale]/(public)/_components/report-dialog";
import { ActorCards } from "@/app/[locale]/(public)/_components/actor-cards";
import { RelatedSeries } from "@/app/[locale]/(public)/series/_components/related-series";
import { EpisodeList } from "@/app/[locale]/(public)/series/_components/episode-list";
import { StarRating } from "@/components/star-rating";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import Image from "next/image";
import { Flag, Play } from "lucide-react";
import { episodeApi } from "@/lib/api-client";

interface EpisodeDetailPageProps {
  params: Promise<{ sslug: string; eslug: string }>;
}

export default function EpisodeDetailPage({ params }: EpisodeDetailPageProps) {
  const { sslug, eslug } = use(params);
  const serieId = extractIdFromSlug(sslug);
  const episodeId = extractIdFromSlug(eslug);
  const { addToWatchHistory } = useWatchHistory();
  const hasAddedToHistory = useRef(false);
  const [userRating, setUserRating] = useState(0);
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);

  if (!serieId || !episodeId) notFound();
  const serieIdValue = serieId as string;
  const episodeIdValue = episodeId as string;

  const auth = useAuth();
  const queryClient = useQueryClient();
  const {
    data: serie,
    isLoading: isSerieLoading,
    error: serieError,
  } = useSerieDetail(serieIdValue);
  const {
    data: episode,
    isLoading: isEpisodeLoading,
    error: episodeError,
    refetch: refetchEpisode,
  } = useEpisodeDetail(episodeIdValue);
  const { data: episodesData } = useEpisodes(
    { seriesId: serieIdValue, pageIndex: 1, pageSize: 30 },
    { enabled: !!serieIdValue }
  );
  const { data: userReview } = useUserReview({
    targetId: serieIdValue.toString(),
    targetType: "tvserie",
  });
  const submitReview = useSubmitReview();

  useEffect(() => {
    if (episode && serie && !hasAddedToHistory.current) {
      addToWatchHistory({
        serieId: serieIdValue,
        episodeId: episodeIdValue,
        episodeNumber: episode.episodeNumber || 1,
      });
      hasAddedToHistory.current = true;
    }
  }, [episode, serie, serieIdValue, episodeIdValue, addToWatchHistory]);

  useEffect(() => {
    if (!episodesData?.data || !episode) return;

    const sortedEpisodes = [...episodesData.data].sort(
      (a, b) => (a.episodeNumber || 0) - (b.episodeNumber || 0)
    );
    const currentIndex = sortedEpisodes.findIndex((item) => item.id === episode.id);
    const nextEpisode = currentIndex >= 0 ? sortedEpisodes[currentIndex + 1] : undefined;

    if (!nextEpisode?.id) return;

    queryClient.prefetchQuery({
      queryKey: [QueryKeys.EPISODES, nextEpisode.id],
      queryFn: () => episodeApi.get(nextEpisode.id),
    });
  }, [episodesData?.data, episode, queryClient]);

  useEffect(() => {
    if (userReview?.rating) {
      setUserRating(userReview.rating);
    } else {
      setUserRating(0);
    }
  }, [userReview]);

  const handleUserRatingChange = async (rating: number) => {
    if (!auth.data) return;
    setUserRating(rating);

    try {
      await submitReview.mutateAsync({
        targetId: serieIdValue.toString(),
        targetType: "tvserie",
        rating,
      });

      await queryClient.invalidateQueries({
        queryKey: [QueryKeys.SERIES, serieIdValue],
      });
    } catch {
      setUserRating(userReview?.rating || 0);
    }
  };

  const refreshPlaybackSource = useCallback(async () => {
    const refreshed = await refetchEpisode();
    return refreshed.data?.videoUrl;
  }, [refetchEpisode]);

  if (isSerieLoading || isEpisodeLoading) {
    return (
      <div className="space-y-6">
        <div className="h-[60vh] rounded-3xl border border-white/10 skeleton-shimmer" />
        <div className="h-6 w-1/3 skeleton-shimmer rounded-full" />
        <div className="h-4 w-1/2 skeleton-shimmer rounded-full" />
      </div>
    );
  }
  if (!serie || !episode || serieError || episodeError) notFound();

  if (episode.seriesId.toString() !== serieIdValue.toString()) notFound();

  return (
    <div className="space-y-10">
      <section className="relative overflow-hidden rounded-3xl border border-white/10">
        <div className="absolute inset-0">
          <Image
            src={serie.backdropPath || serie.posterPath || "/placeholder.png"}
            alt={serie.name}
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
                  <Link href="/">Home</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/series">Series</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href={`/series/${sslug}`}>{serie.name}</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{episode.name}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="grid gap-8 lg:grid-cols-[220px_1fr] items-end">
            <div className="hidden lg:block">
              <div className="glass-panel rounded-2xl overflow-hidden border border-white/10">
                {serie.posterPath ? (
                  <Image
                    src={serie.posterPath}
                    alt={serie.name}
                    width={220}
                    height={320}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-[320px] w-full items-center justify-center text-sm text-muted-foreground">
                    Poster not available
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <h1 className="text-3xl md:text-4xl font-display font-semibold text-foreground">
                {episode.name}{" "}
                <span className="text-muted-foreground text-xl font-normal">
                  (Episode {episode.episodeNumber})
                </span>
              </h1>
              <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                <span>{serie.name}</span>
                <span>•</span>
                {episode.airDate && (
                  <span>
                    {new Date(episode.airDate).toLocaleDateString("en-US", {
                      weekday: "short",
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                )}
                <span>•</span>
                <span>{episode.runtime ? `${episode.runtime} min` : "Episode"}</span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Button
                  asChild
                  className="bg-primary text-primary-foreground shadow-lg shadow-emerald-500/30"
                >
                  <a href="#player">
                    <Play className="h-4 w-4" />
                    Watch Episode
                  </a>
                </Button>
                <FollowButton
                  targetId={serieIdValue.toString()}
                  targetType="tvserie"
                  className="border-white/10 bg-white/5 text-foreground hover:bg-white/10"
                />
                <Button
                  variant="outline"
                  size="sm"
                  className="border-white/10 bg-white/5 text-foreground hover:bg-white/10"
                  onClick={() => setIsReportDialogOpen(true)}
                >
                  <Flag className="w-4 h-4 mr-2" />
                  Report
                </Button>
              </div>

              {serie.genres && serie.genres.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {serie.genres.map((genre) => (
                    <Link
                      key={genre.id}
                      href={`/series?genres=${genre.id}`}
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

              {serie.overview && (
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {serie.overview}
                </p>
              )}

              <div className="glass-panel rounded-2xl p-4 flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-3">
                  <span className="flex items-center justify-center text-xl font-bold w-12 h-12 rounded-xl bg-white/10">
                    {serie.averageRating?.toFixed(1) || 0.0}
                  </span>
                  <div>
                    <StarRating
                      rating={userRating || serie.averageRating || 0}
                      size="lg"
                      interactive={!!auth.data}
                      onRatingChange={handleUserRatingChange}
                    />
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{serie.totalReviews} reviews</span>
                      {!auth.data && (
                        <Badge className="bg-white/10 text-foreground border-white/10">
                          Login to rate
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
        <h2 className="text-lg font-semibold font-display">Player</h2>
        {episode.videoUrl ? (
          <CinematicPlayer
            src={episode.videoUrl}
            title={episode.name}
            poster={serie.backdropPath || serie.posterPath}
            className="ambient-glow"
            refreshSource={refreshPlaybackSource}
          />
        ) : (
          <div className="w-full aspect-video rounded-2xl border border-white/10 bg-white/5 flex items-center justify-center">
            <p className="text-muted-foreground">No video available</p>
          </div>
        )}
      </section>

      {episode.actors && episode.actors.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold font-display">Cast</h2>
          <ActorCards actors={episode.actors} />
        </div>
      )}

      <div className="space-y-3">
        <h2 className="text-lg font-semibold font-display">Episodes</h2>
        <EpisodeList
          serieId={serieIdValue}
          serieSlug={sslug}
          selectedEpisodeId={episodeIdValue}
          backdropFallback={serie.backdropPath || serie.posterPath}
        />
      </div>

      {serie.genres && serie.genres.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold font-display">Because you watched</h2>
          <RelatedSeries currentSerieId={serieIdValue} genres={serie.genres} />
        </div>
      )}

      <ReportDialog
        open={isReportDialogOpen}
        onOpenChange={setIsReportDialogOpen}
        from={`/series/${sslug}/${eslug}`}
        targetTitle={`${serie.name} - ${episode.name}`}
      />
    </div>
  );
}
