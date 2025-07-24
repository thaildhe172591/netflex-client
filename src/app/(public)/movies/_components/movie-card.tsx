"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";
import { Movie } from "@/models";
import { generateSlug } from "@/lib/slug";

interface MovieCardProps {
  movie: Movie;
}

export function MovieCard({ movie }: MovieCardProps) {
  const movieSlug = generateSlug(movie.id, movie.title);

  return (
    <Link href={`/movies/${movieSlug}`}>
      <Card className="group relative overflow-hidden p-0 rounded-md gap-2 cursor-pointer transition-all hover:shadow-lg">
        <div className="aspect-[4/5] relative overflow-hidden rounded-t-md">
          <Image
            src={movie.posterPath || "/placeholder.png"}
            alt={movie.title}
            fill
            className="object-cover transition-transform group-hover:scale-110 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="absolute bottom-1 right-1">
            {movie.videoUrl ? (
              <Badge className="text-xs rounded-sm">Watch Now</Badge>
            ) : (
              <Badge className="text-xs rounded-sm" variant="secondary">
                Coming Soon
              </Badge>
            )}
          </div>
        </div>
        <div className="p-2 pt-0">
          <h3 className="text-sm font-medium line-clamp-1">{movie.title}</h3>
          <span className="text-xs text-muted-foreground">
            {movie.releaseDate
              ? new Date(movie.releaseDate).toLocaleDateString("en-US", {
                  month: "short",
                  day: "2-digit",
                  year: "numeric",
                })
              : "TBA"}
          </span>
        </div>
      </Card>
    </Link>
  );
}
