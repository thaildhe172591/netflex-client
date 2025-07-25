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

  if (!serie || serieError || episodeError) notFound();

  return (
    <div className="space-y-6">
      <div className="mb-4">
        <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 rounded animate-pulse w-1/4"></div>
      </div>

      <div className="mb-6">
        <div className="w-full aspect-video bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 rounded-lg animate-pulse flex items-center justify-center">
          <div className="text-gray-400 dark:text-gray-500">
            <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 20 20">
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
