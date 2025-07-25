"use client";

import { notFound } from "next/navigation";
import { useMovieDetail } from "@/hooks/movie/use-movie-detail";
import { useUserReview } from "@/hooks/review/use-user-review";
import { useSubmitReview } from "@/hooks/review/use-submit-review";
import { useAuth } from "@/hooks/use-auth";
import { extractIdFromSlug } from "@/lib/slug";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { HlsVideoPlayer } from "@/components/hls-video-player";
import { FollowButton } from "@/app/(public)/_components/follow-button";
import { ReportDialog } from "@/app/(public)/_components/report-dialog";
import { ActorCards } from "@/app/(public)/_components/actor-cards";
import { RelatedMovies } from "@/app/(public)/movies/_components/related-movies";
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
import Link from "next/link";
import Image from "next/image";
import { Flag } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { QueryKeys } from "@/constants/query-keys";

interface MovieDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default function MovieDetailPage({ params }: MovieDetailPageProps) {
  const { slug } = use(params);
  const movieId = extractIdFromSlug(slug);
  const [userRating, setUserRating] = useState(0);
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);

  if (!movieId) notFound();

  const auth = useAuth();
  const queryClient = useQueryClient();
  const { data: movie, isLoading, error } = useMovieDetail(movieId);
  const { data: userReview } = useUserReview({
    targetId: movieId.toString(),
    targetType: "movie",
  });
  const submitReview = useSubmitReview();

  useEffect(() => {
    if (userReview?.data?.rating) {
      setUserRating(userReview.data.rating);
    } else {
      setUserRating(0);
    }
  }, [userReview]);

  if (isLoading)
    return (
      <div className="space-y-6">
        <div className="mb-4">
          <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-2-grdark:from-gray-700 dark:via-gray-600 dark:to-gray-700 rounded animate-pulse w-1/4"></div>
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
  if (!movie || error) notFound();

  const handleUserRatingChange = async (rating: number) => {
    if (!auth.data) return;
    setUserRating(rating);

    try {
      await submitReview.mutateAsync({
        targetId: movieId.toString(),
        targetType: "movie",
        rating,
      });

      await queryClient.invalidateQueries({
        queryKey: [QueryKeys.MOVIES, movieId],
      });
    } catch {
      setUserRating(userReview?.data?.rating || 0);
    }
  };

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
              <Link href="/movies">Movies</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{movie.title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="mb-6">
        {movie.videoUrl ? (
          <HlsVideoPlayer
            src={movie.videoUrl}
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
            {movie.posterPath ? (
              <Image
                src={movie.posterPath}
                alt={movie.title}
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
            {movie.title}{" "}
            <span className="font-normal">
              ({movie.releaseDate && new Date(movie.releaseDate).getFullYear()})
            </span>
          </h1>
          <div className="flex flex-wrap items-center gap-2 text-sm">
            {movie.releaseDate && (
              <>
                <span>
                  {new Date(movie.releaseDate).toLocaleDateString("en-US", {
                    weekday: "long",
                    day: "numeric",
                    month: "numeric",
                    year: "numeric",
                  })}
                </span>
                <span>•</span>
              </>
            )}
            {movie.runtime && (
              <>
                <span>{movie.runtime} minutes</span>
                <span>•</span>
              </>
            )}
            <span>{movie.countryIso ? movie.countryIso : "N/A"}</span>
          </div>

          <div className="flex items-center gap-2">
            <FollowButton targetId={movieId.toString()} targetType="movie" />
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
                {movie.averageRating?.toFixed(1) || 0}
              </span>
              <div className="flex flex-col gap-1">
                <StarRating
                  rating={userRating}
                  size="lg"
                  interactive={!!auth.data}
                  onRatingChange={handleUserRatingChange}
                />
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <span>{movie.totalReviews} reviews</span>

                  {!auth.data && (
                    <>
                      <Badge
                        variant="secondary"
                        className="bg-blue-500 text-white dark:bg-blue-600 rounded"
                      >
                        Login to rate
                      </Badge>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
          {movie.genres && movie.genres.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {movie.genres.map((genre) => (
                <Link
                  key={genre.id}
                  href={`/movies?genres=${genre.id}`}
                  className="transition-transform duration-200 hover:scale-105 active:scale-95"
                >
                  <Badge
                    variant={"outline"}
                    className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors duration-200 rounded"
                  >
                    {genre.name}
                  </Badge>
                </Link>
              ))}
            </div>
          ) : (
            <Badge variant="outline" className="rounded">
              No genre
            </Badge>
          )}

          {movie.overview && (
            <p className="text-sm text-muted-foreground leading-relaxed">
              {movie.overview}
            </p>
          )}
        </div>
      </div>
      {movie.actors && movie.actors.length > 0 && (
        <div className="w-full mt-2">
          <ActorCards actors={movie.actors} />
        </div>
      )}

      {movie.genres && movie.genres.length > 0 && (
        <div className="w-full mt-2">
          <RelatedMovies currentMovieId={movieId} genres={movie.genres} />
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
