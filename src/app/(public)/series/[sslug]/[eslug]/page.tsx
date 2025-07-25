"use client";

import { notFound } from "next/navigation";
import { useEpisodeDetail } from "@/hooks/episode/use-episode-detail";
import { useSerieDetail } from "@/hooks/serie/use-serie-detail";
import { extractIdFromSlug } from "@/lib/slug";
import { use, useEffect, useRef, useState } from "react";
import { useWatchHistory } from "@/app/(public)/series/_hooks/use-watch-history";
import { useUserReview } from "@/hooks/review/use-user-review";
import { useSubmitReview } from "@/hooks/review/use-submit-review";
import { useAuth } from "@/hooks/use-auth";
import { useQueryClient } from "@tanstack/react-query";
import { QueryKeys } from "@/constants/query-keys";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { HlsVideoPlayer } from "@/components/hls-video-player";
import { FollowButton } from "@/app/(public)/_components/follow-button";
import { ReportDialog } from "@/app/(public)/_components/report-dialog";
import { ActorCards } from "@/app/(public)/_components/actor-cards";
import { RelatedSeries } from "@/app/(public)/series/_components/related-series";
import { EpisodeList } from "@/app/(public)/series/_components/episode-list";
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
import { Flag } from "lucide-react";

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

  const auth = useAuth();
  const queryClient = useQueryClient();
  const {
    data: serie,
    isLoading: isSerieLoading,
    error: serieError,
  } = useSerieDetail(serieId);
  const {
    data: episode,
    isLoading: isEpisodeLoading,
    error: episodeError,
  } = useEpisodeDetail(episodeId);
  const { data: userReview } = useUserReview({
    targetId: serieId.toString(),
    targetType: "serie",
  });
  const submitReview = useSubmitReview();

  useEffect(() => {
    if (episode && serie && !hasAddedToHistory.current) {
      addToWatchHistory({
        serieId: serieId,
        episodeId: episodeId,
        episodeNumber: episode.episodeNumber || 1,
      });
      hasAddedToHistory.current = true;
    }
  }, [episode, serie, serieId, episodeId, addToWatchHistory]);

  useEffect(() => {
    if (userReview?.data?.rating) {
      setUserRating(userReview.data.rating);
    } else {
      setUserRating(0);
    }
  }, [userReview]);

  const handleUserRatingChange = async (rating: number) => {
    if (!auth.data) return;
    setUserRating(rating);

    try {
      await submitReview.mutateAsync({
        targetId: serieId.toString(),
        targetType: "serie",
        rating,
      });

      await queryClient.invalidateQueries({
        queryKey: [QueryKeys.SERIES, serieId],
      });

      await queryClient.invalidateQueries({
        queryKey: [QueryKeys.USER_REVIEW, serieId.toString(), "serie"],
      });
    } catch {
      setUserRating(userReview?.data?.rating || 0);
    }
  };

  if (isSerieLoading || isEpisodeLoading) {
    return (
      <div className="space-y-6">
        <div className="mb-4">
          <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 rounded animate-pulse w-1/4"></div>
        </div>

        <div className="mb-6">
          <div className="w-full aspect-video bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 rounded-lg animate-pulse flex items-center justify-center">
            <div className="text-gray-400 dark:text-gray-500">
              <svg
                className="w-16 h-16"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm3 2h6v4H7V5zm8 8v2h1v-2h-1zm-2-2H7v4h6v-4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    );
  }
  if (!serie || !episode || serieError || episodeError) notFound();

  if (episode.seriesId !== serieId) notFound();

  return (
    <div>
      <Breadcrumb className="mb-4">
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

      <div className="mb-6">
        {episode.videoUrl ? (
          <HlsVideoPlayer
            src={episode.videoUrl}
            className="w-full aspect-video rounded-sm bg-foreground"
          />
        ) : (
          <div className="w-full aspect-video bg-foreground flex items-center justify-center border rounded-sm">
            <p className="text-muted-foreground">No video available</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-4">
        <div className="hidden lg:flex lg:justify-start">
          <div className="w-[200px] h-[280px] bg-muted rounded-sm overflow-hidden shadow-lg">
            {serie.posterPath ? (
              <Image
                src={serie.posterPath}
                alt={serie.name}
                width={200}
                height={200}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center rounded-sm">
                <p className="text-muted-foreground text-center px-4">
                  Poster not available
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold mb-1">
            {episode.name}{" "}
            <span className="font-normal">
              (Episode {episode.episodeNumber})
            </span>
          </h1>
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <span>{serie.name}</span>
            {episode.airDate && (
              <>
                <span>•</span>
                <span>
                  {new Date(episode.airDate).toLocaleDateString("en-US", {
                    weekday: "long",
                    day: "numeric",
                    month: "numeric",
                    year: "numeric",
                  })}
                </span>
              </>
            )}
            {episode.runtime && (
              <>
                <span>•</span>
                <span>{episode.runtime} minutes</span>
              </>
            )}
          </div>

          <div className="flex items-center gap-2">
            <FollowButton targetId={serieId.toString()} targetType="serie" />
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsReportDialogOpen(true)}
            >
              <Flag className="w-4 h-4 mr-2" />
              Report
            </Button>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <span className="flex items-center justify-center text-xl font-bold w-12 h-12 bg-muted-foreground rounded text-background">
                {serie.averageRating?.toFixed(1) || 0.0}
              </span>
              <div className="flex flex-col gap-1">
                <StarRating
                  rating={userRating || serie.averageRating || 0}
                  size="lg"
                  interactive={!!auth.data}
                  onRatingChange={handleUserRatingChange}
                />
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <span>{serie.totalReviews} reviews</span>
                  {!auth.data && (
                    <Badge
                      variant="secondary"
                      className="bg-blue-500 text-white dark:bg-blue-600 rounded text-xs"
                    >
                      Login to rate
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>

          {serie.genres && serie.genres.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {serie.genres.map((genre) => (
                <Link
                  key={genre.id}
                  href={`/series?genres=${genre.id}`}
                  className="transition-transform duration-200 hover:scale-105 active:scale-95"
                >
                  <Badge
                    variant="outline"
                    className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors duration-200 rounded"
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
        </div>
      </div>
      {episode.actors && episode.actors.length > 0 && (
        <div className="w-full mt-2">
          <ActorCards actors={episode.actors} />
        </div>
      )}

      <div className="w-full mt-2">
        <EpisodeList
          serieId={serieId}
          serieSlug={sslug}
          selectedEpisodeId={episodeId}
        />
      </div>

      {serie.genres && serie.genres.length > 0 && (
        <div className="w-full mt-2">
          <RelatedSeries currentSerieId={serieId} genres={serie.genres} />
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
