"use client";

import { forwardRef, useEffect, useState } from "react";
import Image from "next/image";
import { Episode } from "@/models/episode";
import { cn } from "@/lib/utils";
import { generateThumbnailFromHls } from "@/lib/generate-thumbnail";

interface EpisodeCardProps {
  episode: Episode;
  isSelected?: boolean;
  isDragging?: boolean;
  onClick: (episode: Episode) => void;
  backdropFallback?: string;
}

export const EpisodeCard = forwardRef<HTMLDivElement, EpisodeCardProps>(
  ({ episode, isSelected = false, isDragging = false, onClick, backdropFallback }, ref) => {
    const [thumbnail, setThumbnail] = useState<string | null>(null);

    const handleClick = () => {
      if (isDragging) return;
      onClick(episode);
    };

    useEffect(() => {
      if (!episode.videoUrl) return;
      generateThumbnailFromHls(episode.videoUrl).then(setThumbnail);
    }, [episode.videoUrl]);

    return (
      <div ref={ref} className="w-[280px] flex-shrink-0">
        <div
          className={cn(
            "group relative overflow-hidden cursor-pointer transition-all rounded-2xl border border-white/10 bg-white/5 shadow-lg hover:-translate-y-1",
            isSelected && "border-primary/60 shadow-[0_0_18px_rgba(34,197,94,0.35)]"
          )}
          onClick={handleClick}
        >
          <div className="aspect-video relative overflow-hidden">
            {thumbnail || backdropFallback ? (
              <Image
                src={thumbnail || backdropFallback || "/placeholder.png"}
                alt={`Episode ${episode.episodeNumber} - ${episode.name}`}
                fill
                className="object-cover"
                sizes="280px"
              />
            ) : (
              <div className="w-full h-full bg-muted flex items-center justify-center">
                <p className="text-muted-foreground text-sm">
                  Episode {episode.episodeNumber}
                </p>
              </div>
            )}

            <div className="absolute top-2 left-2 bg-black/70 text-white px-2 py-1 rounded-full text-xs font-medium">
              Ep {episode.episodeNumber}
            </div>

            {isSelected && (
              <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                <div className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-medium">
                  Now Playing
                </div>
              </div>
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>

          <div className="p-3">
            <h3
              className={cn(
                "text-sm font-semibold line-clamp-1 mb-1 text-foreground",
                isSelected && "text-primary"
              )}
            >
              {episode.name}
            </h3>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              {episode.airDate && (
                <span>
                  {new Date(episode.airDate).toLocaleDateString("en-US", {
                    month: "short",
                    day: "2-digit",
                    year: "numeric",
                  })}
                </span>
              )}
              {episode.runtime && (
                <>
                  <span>•</span>
                  <span>{episode.runtime}m</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
);

EpisodeCard.displayName = "EpisodeCard";
