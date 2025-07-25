"use client";

import { useMovies } from "@/hooks/movie/use-movies";
import { useSeries } from "@/hooks/serie/use-series";
import { Badge } from "@/components/ui/badge";
import { Star, Calendar, Play } from "lucide-react";
import Link from "next/link";
import { MovieCard } from "./movies/_components/movie-card";
import { SerieCard } from "./series/_components/serie-card";

export default function HomePage() {
  const { data: moviesData, isLoading: moviesLoading } = useMovies({
    sortby: "averageRating.desc",
    pageSize: 5,
  });

  const { data: seriesData, isLoading: seriesLoading } = useSeries({
    sortBy: "averageRating.desc",
    pageSize: 5,
  });

  const movies = moviesData?.data || [];
  const series = seriesData?.data || [];

  return (
    <div className="min-h-screen">
      <section className="py-10">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-2xl md:text-3xl lg:text-5xl font-bold text-gray-900 mb-6">
              Welcome to{" "}
              <span className="bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent">
                NETFLEX
              </span>
            </h1>
            <p className="text-sm md:text-base text-gray-600 mb-8 leading-relaxed">
              Discover the world of cinema with thousands of high-quality movies
              and series. Experience the best entertainment from the most
              watchable content.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Badge
                variant="secondary"
                className="px-4 py-2 text-sm bg-background"
              >
                🎬 High Quality Movies
              </Badge>
              <Badge
                variant="secondary"
                className="px-4 py-2 text-sm bg-background"
              >
                📺 Diverse Series
              </Badge>
              <Badge
                variant="secondary"
                className="px-4 py-2 text-sm bg-background"
              >
                ⭐ Top Rated
              </Badge>
            </div>
          </div>
        </div>
      </section>

      <section className="py-10">
        <div className="container mx-auto px-4">
          <div className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="md:text-lg font-bold text-gray-900 mb-2">
                  Top 5 Must-Watch Movies
                </h2>
                <p className="text-gray-600 text-sm">
                  The highest rated movies
                </p>
              </div>
              <Link
                href="/movies"
                className="text-gray-700 hover:text-gray-900 font-medium transition-colors text-sm hover:underline"
              >
                View All →
              </Link>
            </div>

            {moviesLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-gray-200 aspect-[2/3] rounded-lg mb-4"></div>
                    <div className="bg-gray-200 h-4 rounded mb-2"></div>
                    <div className="bg-gray-200 h-3 rounded w-3/4"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                {movies.map((movie) => (
                  <MovieCard key={movie.id} movie={movie} />
                ))}
              </div>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="md:text-lg font-bold text-gray-900 mb-2">
                  Top 5 Must-Watch Series
                </h2>
                <p className="text-gray-600 text-sm">The most loved series</p>
              </div>
              <Link
                href="/series"
                className="text-gray-700 hover:text-gray-900 font-medium transition-colors text-sm hover:underline"
              >
                View All →
              </Link>
            </div>

            {seriesLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-gray-200 aspect-[2/3] rounded-lg mb-4"></div>
                    <div className="bg-gray-200 h-4 rounded mb-2"></div>
                    <div className="bg-gray-200 h-3 rounded w-3/4"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                {series.map((serie) => (
                  <SerieCard key={serie.id} serie={serie} />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="py-10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-8">
              Why Choose NETFLEX?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-4 bg-gray-900 rounded-full flex items-center justify-center">
                  <Play className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  High Quality
                </h3>
                <p className="text-gray-600 text-sm">
                  All content is carefully curated with excellent video and
                  audio quality.
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-4 bg-gray-900 rounded-full flex items-center justify-center">
                  <Star className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Trusted Ratings
                </h3>
                <p className="text-gray-600 text-sm">
                  Community rating system helps you easily find the best
                  content.
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-4 bg-gray-900 rounded-full flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Regular Updates
                </h3>
                <p className="text-sm text-gray-600">
                  Library is continuously updated with the latest movies and
                  series.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
