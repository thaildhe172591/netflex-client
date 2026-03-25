"use client";

import { ReactNode, HTMLAttributes, useRef, useState, useCallback, useEffect } from "react";
import { SectionHeader } from "./section-header";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MediaRailProps {
  title: string;
  subtitle?: string;
  href?: string;
  actionLabel?: string;
  children: ReactNode;
  className?: string;
}

export function MediaRail({
  title,
  subtitle,
  href,
  actionLabel,
  children,
  className,
}: MediaRailProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const updateArrows = useCallback(() => {
    if (!containerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
    setShowLeftArrow(scrollLeft > 20);
    setShowRightArrow(Math.ceil(scrollLeft + clientWidth) < scrollWidth - 20);
  }, []);

  useEffect(() => {
    updateArrows();
    window.addEventListener("resize", updateArrows);
    return () => window.removeEventListener("resize", updateArrows);
  }, [updateArrows, children]);

  const handleScroll = () => {
    updateArrows();
  };

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

  const handleMouseUpOrLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const scrollByAmount = (direction: "left" | "right") => {
    if (!containerRef.current) return;
    const { clientWidth } = containerRef.current;
    const scrollAmount = direction === "left" ? -(clientWidth * 0.75) : clientWidth * 0.75;
    containerRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  return (
    <section className={cn("space-y-4 group/rail", className)}>
      <SectionHeader
        title={title}
        subtitle={subtitle}
        href={href}
        actionLabel={actionLabel}
      />
      <div className="relative isolate px-1">
        {/* Left Arrow */}
        {showLeftArrow && (
          <div className="absolute left-0 top-0 bottom-0 z-20 flex w-12 items-center justify-start bg-gradient-to-r from-background via-background/80 to-transparent opacity-0 transition-opacity duration-300 group-hover/rail:opacity-100">
            <Button
              variant="ghost"
              size="icon"
              className="h-full w-full rounded-none hover:bg-black/40 text-white hover:text-white"
              onClick={() => scrollByAmount("left")}
              aria-label="Scroll Left"
            >
              <ChevronLeft className="h-8 w-8 drop-shadow-lg" />
            </Button>
          </div>
        )}

        {/* Right Arrow */}
        {showRightArrow && (
          <div className="absolute right-0 top-0 bottom-0 z-20 flex w-12 items-center justify-end bg-gradient-to-l from-background via-background/80 to-transparent opacity-0 transition-opacity duration-300 group-hover/rail:opacity-100">
            <Button
              variant="ghost"
              size="icon"
              className="h-full w-full rounded-none hover:bg-black/40 text-white hover:text-white"
              onClick={() => scrollByAmount("right")}
              aria-label="Scroll Right"
            >
              <ChevronRight className="h-8 w-8 drop-shadow-lg" />
            </Button>
          </div>
        )}

        <div
          ref={containerRef}
          onScroll={handleScroll}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUpOrLeave}
          onMouseLeave={handleMouseUpOrLeave}
          className={cn(
            "rail-scroll flex gap-4 overflow-x-auto scrollbar-hide select-none py-4 touch-pan-x content-visibility-auto contain-paint",
            isDragging ? "cursor-grabbing" : "cursor-grab",
            // Optionally remove snap for smoother free scrolling like Netflix, or keep snap-mandatory.
            // "snap-x snap-mandatory [&>*]:snap-start"
          )}
          style={{
            // Optimize GPU rendering for the rail container
            willChange: "transform",
            contentVisibility: "auto",
            contain: "paint layout",
          }}
        >
          {children}
        </div>
      </div>
    </section>
  );
}
