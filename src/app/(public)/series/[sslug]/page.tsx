"use client";

import { notFound, useRouter } from "next/navigation";
import { useSerieDetail } from "@/hooks/serie/use-serie-detail";
import { useFirstEpisode } from "@/app/(public)/series/_hooks/use-first-episode";
import { useWatchHistory } from "@/app/(public)/series/_hooks/use-watch-history";
import { extractIdFromSlug, generateSlug } from "@/lib/slug";
import { use, useEffect } from "react";

interface SerieDetailPageProps {
  params: Promise<{ sslug: string }>;
}

export default function SerieDetailPage({ params }: SerieDetailPageProps) {
  const { sslug } = use(params);
  const router = useRouter();
  const serieId = extractIdFromSlug(sslug);
  const { getLastWatchedEpisode } = useWatchHistory();

  if (!serieId) notFound();

  const {
    data: serie,
    isLoading: isSerieLoading,
    error: serieError,
  } = useSerieDetail(serieId);
  const {
    data: firstEpisode,
    isLoading: isEpisodeLoading,
    error: episodeError,
  } = useFirstEpisode(serieId);

  useEffect(() => {
    if (!isSerieLoading && !isEpisodeLoading && serie && firstEpisode) {
      const lastWatched = getLastWatchedEpisode(serieId);

      if (lastWatched) {
        const episodeSlug = generateSlug(
          lastWatched.episodeId,
          firstEpisode.name
        );
        router.replace(`/series/${sslug}/${episodeSlug}`);
      } else if (firstEpisode) {
        const episodeSlug = generateSlug(firstEpisode.id, firstEpisode.name);
        router.replace(`/series/${sslug}/${episodeSlug}`);
      } else {
        notFound();
      }
    }
  }, [
    isSerieLoading,
    isEpisodeLoading,
    serie,
    firstEpisode,
    serieId,
    getLastWatchedEpisode,
    router,
    sslug,
  ]);

  if (isSerieLoading || isEpisodeLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4 h-8 w-full"></div>
      </div>
    );
  }

  if (!serie || serieError || episodeError) notFound();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="animate-pulse space-y-4 h-8 w-full"></div>
    </div>
  );
}
