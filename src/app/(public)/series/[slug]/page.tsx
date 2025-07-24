"use client";

import { notFound } from "next/navigation";
import { useSerieDetail } from "@/hooks/serie/use-serie-detail";
import { extractIdFromSlug } from "@/lib/slug";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { use } from "react";

interface SerieDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default function SerieDetailPage({ params }: SerieDetailPageProps) {
  const { slug } = use(params);
  const serieId = extractIdFromSlug(slug);

  if (!serieId) {
    notFound();
  }

  const { data: serie, isLoading, error } = useSerieDetail(serieId.toString());

  if (error) {
    notFound();
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <Skeleton className="aspect-[4/5] w-full rounded-lg" />
          </div>
          <div className="md:col-span-2 space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-24 w-full" />
            <div className="flex gap-2">
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-6 w-16" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!serie) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <Card className="overflow-hidden">
            <div className="aspect-[4/5] relative">
              <Image
                src={serie.posterPath || "/placeholder.png"}
                alt={serie.name}
                fill
                className="object-cover"
              />
            </div>
          </Card>
        </div>

        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl font-bold">{serie.name}</CardTitle>
              <div className="flex gap-2 items-center">
                <Badge variant="secondary">
                  {serie.lastAirDate ? "Completed" : "Ongoing"}
                </Badge>
                <span className="text-muted-foreground">
                  {serie.firstAirDate
                    ? new Date(serie.firstAirDate).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "TBA"}
                </span>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {serie.overview && (
                <div>
                  <h3 className="font-semibold mb-2">Overview</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {serie.overview}
                  </p>
                </div>
              )}

              {serie.genres && serie.genres.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Genres</h3>
                  <div className="flex flex-wrap gap-2">
                    {serie.genres.map((genre) => (
                      <Badge key={genre.id} variant="outline">
                        {genre.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                {serie.firstAirDate && (
                  <div>
                    <h3 className="font-semibold mb-2">First Air Date</h3>
                    <p className="text-muted-foreground">
                      {new Date(serie.firstAirDate).toLocaleDateString(
                        "en-US",
                        {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        }
                      )}
                    </p>
                  </div>
                )}

                {serie.lastAirDate && (
                  <div>
                    <h3 className="font-semibold mb-2">Last Air Date</h3>
                    <p className="text-muted-foreground">
                      {new Date(serie.lastAirDate).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
