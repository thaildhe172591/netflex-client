"use client";

import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Serie } from "@/models";
import { generateSlug } from "@/lib/slug";
import { Info, Play, Plus } from "lucide-react";
import { useLoadingStore } from "@/stores/loading-store";

interface SerieCardProps {
  serie: Serie;
}

export function SerieCard({ serie }: SerieCardProps) {
  const router = useRouter();
  const serieSlug = generateSlug(serie.id, serie.name);

  const startRouteLoading = useLoadingStore((state) => state.startRouteLoading);

  const handleClick = () => {
    startRouteLoading();
    router.push(`/series/${serieSlug}`);
  };

  const [isHovering, setIsHovering] = useState(false);

  return (
    <div
      className="group relative cursor-pointer"
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          handleClick();
        }
      }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className="relative aspect-[2/3] overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-lg transition-all duration-300 group-hover:scale-105 group-hover:shadow-[0_0_24px_rgba(225,29,72,0.3)] group-hover:z-10">
        <Image
          src={serie.posterPath || "/placeholder.png"}
          alt={serie.name}
          fill
          unoptimized
          sizes="(max-width: 640px) 45vw, (max-width: 1024px) 25vw, 200px"
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-80" />
        <div className="absolute top-3 left-3 flex gap-2">
          <Badge className="bg-white/10 text-foreground border-white/10 rounded-full backdrop-blur-md">
            {serie.averageRating?.toFixed(1) ?? "NR"}
          </Badge>
          <Badge className="bg-white/10 text-foreground border-white/10 rounded-full backdrop-blur-md">
            {serie.lastAirDate ? "Complete" : "Ongoing"}
          </Badge>
        </div>
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <div className="flex gap-2">
            <Button
              size="icon"
              className="h-8 w-8 bg-primary text-primary-foreground shadow-lg shadow-emerald-500/30"
              onClick={(event) => {
                event.stopPropagation();
                handleClick();
              }}
              aria-label="Play"
            >
              <Play className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="outline"
              className="h-8 w-8 border-white/10 bg-white/10 text-foreground hover:bg-white/20"
              onClick={(event) => {
                event.stopPropagation();
              }}
              aria-label="Add to list"
            >
              <Plus className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 text-foreground/80 hover:text-foreground"
              onClick={(event) => {
                event.stopPropagation();
                handleClick();
              }}
              aria-label="More info"
            >
              <Info className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      <div className="mt-3 space-y-1">
        <h3 className="text-sm font-semibold text-foreground line-clamp-1">
          {serie.name}
        </h3>
        <span className="text-xs text-muted-foreground">
          {serie.firstAirDate
            ? new Date(serie.firstAirDate).toLocaleDateString("en-US", {
              month: "short",
              day: "2-digit",
              year: "numeric",
            })
            : "TBA"}
        </span>
      </div>
    </div>
  );
}
