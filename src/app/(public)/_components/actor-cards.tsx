"use client";

import { useCallback, useRef, useState } from "react";
import { Actor } from "@/models/actor";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface IProps {
  actors: Actor[];
  className?: string;
}

export function ActorCards({ actors, className }: IProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!containerRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - containerRef.current.offsetLeft);
    setScrollLeft(containerRef.current.scrollLeft);
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging || !containerRef.current) return;
      e.preventDefault();
      const x = e.pageX - containerRef.current.offsetLeft;
      const walk = (x - startX) * 2;
      containerRef.current.scrollLeft = scrollLeft - walk;
    },
    [isDragging, startX, scrollLeft]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  if (!actors || actors.length === 0) {
    return null;
  }

  return (
    <div className={cn("relative", className)}>
      <div
        ref={containerRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide select-none py-2"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {actors.map((actor) => (
          <div
            key={actor.id}
            className="flex items-center gap-3 bg-card border border-border rounded-lg p-2 min-w-[200px] hover:bg-accent transition-colors cursor-pointer shadow-sm"
          >
            <div className="w-12 h-12 bg-muted rounded-full overflow-hidden flex-shrink-0">
              {actor.image ? (
                <Image
                  src={actor.image}
                  alt={actor.name}
                  width={48}
                  height={48}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-muted">
                  <span className="text-muted-foreground text-xs">
                    {actor.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{actor.name}</p>
              <p className="text-xs text-muted-foreground">
                {actor.gender ? "Male" : "Female"}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
