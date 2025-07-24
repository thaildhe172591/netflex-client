"use client";

import { notFound } from "next/navigation";
import { useMovieDetail } from "@/hooks/movie/use-movie-detail";
import { extractIdFromSlug } from "@/lib/slug";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { use } from "react";

interface MovieDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default function MovieDetailPage({ params }: MovieDetailPageProps) {
  const { slug } = use(params);
  const movieId = extractIdFromSlug(slug);

  if (!movieId) {
    notFound();
  }

  const { data: movie, isLoading, error } = useMovieDetail(movieId.toString());

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

  if (!movie) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <Card className="overflow-hidden">
            <div className="aspect-[4/5] relative">
              <Image
                src={movie.posterPath || "/placeholder.png"}
                alt={movie.title}
                fill
                className="object-cover"
              />
            </div>
          </Card>
        </div>

        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl font-bold">
                {movie.title}
              </CardTitle>
              <div className="flex gap-2 items-center">
                {movie.videoUrl ? (
                  <Badge>Watch Now</Badge>
                ) : (
                  <Badge variant="secondary">Coming Soon</Badge>
                )}
                <span className="text-muted-foreground">
                  {movie.releaseDate
                    ? new Date(movie.releaseDate).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "TBA"}
                </span>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {movie.overview && (
                <div>
                  <h3 className="font-semibold mb-2">Overview</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {movie.overview}
                  </p>
                </div>
              )}

              {movie.genres && movie.genres.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Genres</h3>
                  <div className="flex flex-wrap gap-2">
                    {movie.genres.map((genre) => (
                      <Badge key={genre.id} variant="outline">
                        {genre.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {movie.runtime && (
                <div>
                  <h3 className="font-semibold mb-2">Runtime</h3>
                  <p className="text-muted-foreground">
                    {movie.runtime} minutes
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
