"use client";

import { useSeries } from "@/hooks/serie/use-series";
import { Serie } from "@/models/serie";
import { Genre } from "@/models/genre";
import { cn } from "@/lib/utils";
import { SerieCard } from "@/app/[locale]/(public)/series/_components/serie-card";
import { SerieCardSkeleton } from "@/app/[locale]/(public)/series/_components/serie-card-skeleton";
import { MediaRail } from "@/app/[locale]/(public)/_components/media-rail";
import { useTranslations } from "next-intl";

interface IProps {
  currentSerieId: string;
  genres: Genre[];
  className?: string;
}

export function RelatedSeries({ currentSerieId, genres, className }: IProps) {
  const t = useTranslations("MovieDetail");
  const { data: relatedSeriesData, isLoading } = useSeries({
    genres: genres.map((g) => g.id),
    pageSize: 20,
    pageIndex: 1,
  });

  const relatedSeries =
    relatedSeriesData?.data?.filter(
      (serie: Serie) => serie.id !== currentSerieId
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
              <SerieCardSkeleton />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!relatedSeries || relatedSeries.length === 0) {
    return null;
  }

  return (
    <div className={cn("mt-4", className)}>
      <MediaRail title={t("related_movies")}>
        {relatedSeries.map((serie: Serie) => (
          <div key={serie.id} className="w-[140px] sm:w-[160px] md:w-[180px] lg:w-[200px] flex-none">
            <SerieCard serie={serie} />
          </div>
        ))}
      </MediaRail>
    </div>
  );
}
