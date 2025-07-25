"use client";

import { forwardRef } from "react";
import { Episode } from "@/models/episode";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

interface EpisodeCardProps {
  episode: Episode;
  isSelected?: boolean;
  isDragging?: boolean;
  onClick: (episode: Episode) => void;
}

export const EpisodeCard = forwardRef<HTMLDivElement, EpisodeCardProps>(
  ({ episode, isSelected = false, isDragging = false, onClick }, ref) => {
    const handleClick = () => {
      if (isDragging) return;
      onClick(episode);
    };

    return (
      <div ref={ref} className="w-[280px]">
        <Card
          className={cn(
            "group relative overflow-hidden p-0 cursor-pointer transition-all hover:shadow-lg gap-1",
            isSelected && "ring-2 ring-primary"
          )}
          onClick={handleClick}
        >
          <div className="aspect-video relative overflow-hidden">
            <div className="w-full h-full bg-muted flex items-center justify-center">
              <p className="text-muted-foreground text-sm">
                Episode {episode.episodeNumber}
              </p>
            </div>

            <div className="absolute top-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs font-medium">
              Ep {episode.episodeNumber}
            </div>

            {isSelected && (
              <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                <div className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
                  Now Playing
                </div>
              </div>
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>

          <div className="p-3">
            <h3
              className={cn(
                "text-sm font-medium line-clamp-1 mb-1",
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
        </Card>
      </div>
    );
  }
);

EpisodeCard.displayName = "EpisodeCard";
