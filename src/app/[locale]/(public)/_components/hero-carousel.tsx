"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence, useReducedMotion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Movie } from "@/models";
import { generateSlug } from "@/lib/slug";
import { toPlayableMediaUrl } from "@/lib/media-url";
import { Info, Play, Plus } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const AUTOPLAY_MS = 6500;

interface HeroCarouselProps {
  items: Movie[];
}

export function HeroCarousel({ items }: HeroCarouselProps) {
  const shouldReduceMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const [previewActive, setPreviewActive] = useState(false);
  const { scrollY } = useScroll();
  const parallaxY = useTransform(scrollY, [0, 400], [0, shouldReduceMotion ? 0 : 40]);

  const [isVideoReady, setIsVideoReady] = useState(false);

  const featured = useMemo(() => items.slice(0, 5), [items]);
  const activeItem = featured[activeIndex];

  useEffect(() => {
    if (!previewActive) {
      setIsVideoReady(false);
    }
  }, [previewActive]);

  useEffect(() => {
    if (featured.length < 2) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % featured.length);
    }, AUTOPLAY_MS);
    return () => clearInterval(interval);
  }, [featured.length]);

  useEffect(() => {
    if (activeIndex >= featured.length) {
      setActiveIndex(0);
    }
  }, [activeIndex, featured.length]);

  if (!activeItem) {
    return (
      <section className="relative min-h-[60vh] rounded-3xl border border-white/10 glass-panel-strong" />
    );
  }

  const heroImage = activeItem.backdropPath || activeItem.posterPath || "/placeholder.png";
  const heroSlug = generateSlug(activeItem.id, activeItem.title);
  const allowPreview =
    !!activeItem.videoUrl && !activeItem.videoUrl.toLowerCase().includes(".m3u8");
  const previewUrl = activeItem.videoUrl ? toPlayableMediaUrl(activeItem.videoUrl) : "";

  return (
    <section
      className="relative overflow-hidden rounded-3xl border border-white/10 min-h-[68vh] lg:min-h-[78vh]"
      onMouseEnter={() => setPreviewActive(true)}
      onMouseLeave={() => setPreviewActive(false)}
      onFocus={() => setPreviewActive(true)}
      onBlur={() => setPreviewActive(false)}
      onTouchStart={() => setPreviewActive(true)}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={activeItem.id}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div style={{ y: parallaxY }} className="absolute inset-0">
            <Image
              src={heroImage}
              alt={activeItem.title}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 80vw"
              className={cn(
                "object-cover transition-transform duration-700",
                previewActive && "scale-105"
              )}
            />
          </motion.div>
          {!shouldReduceMotion && allowPreview && previewActive && (
            <video
              className={cn(
                "absolute inset-0 hidden lg:block object-cover transition-opacity duration-700",
                isVideoReady ? "opacity-100" : "opacity-0"
              )}
              autoPlay
              muted
              loop
              playsInline
              crossOrigin="anonymous"
              poster={heroImage}
              src={previewUrl}
              onCanPlay={() => setIsVideoReady(true)}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-[#020617] via-[#020617cc] to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent" />
        </motion.div>
      </AnimatePresence>

      <div className="relative z-10 flex min-h-[68vh] lg:min-h-[78vh] flex-col justify-end p-6 md:p-10">
        <div className="max-w-2xl space-y-4">
          <span className="inline-flex items-center gap-3 text-xs uppercase tracking-[0.4em] text-muted-foreground">
            Featured Tonight
          </span>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-display font-semibold text-foreground text-glow">
            {activeItem.title}
          </h1>
          <p className="text-sm md:text-base text-muted-foreground line-clamp-3">
            {activeItem.overview ||
              "An immersive cinematic experience curated for late-night binge sessions."}
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Button asChild className="shadow-lg shadow-emerald-500/30">
              <Link href={`/movies/${heroSlug}`}>
                <Play className="h-4 w-4" />
                Play Now
              </Link>
            </Button>
            <Button
              variant="outline"
              className="border-white/10 bg-white/5 text-foreground hover:bg-white/10"
            >
              <Plus className="h-4 w-4" />
              My List
            </Button>
            <Button
              variant="ghost"
              className="text-foreground/80 hover:text-foreground"
              asChild
            >
              <Link href={`/movies/${heroSlug}`}>
                <Info className="h-4 w-4" />
                More Info
              </Link>
            </Button>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            <span>Rating {activeItem.averageRating?.toFixed(1) ?? "N/A"}</span>
            <span>•</span>
            <span>{activeItem.runtime ? `${activeItem.runtime} min` : "Feature"}</span>
            <span>•</span>
            <span>{activeItem.countryIso || "Worldwide"}</span>
          </div>
        </div>

        <div className="mt-8 flex gap-2">
          {featured.map((item, index) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-pressed={index === activeIndex}
              className={cn(
                "cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60",
                index === activeIndex
                  ? "h-1.5 w-8 rounded-full bg-primary shadow-[0_0_12px_rgba(34,197,94,0.8)]"
                  : "h-1.5 w-4 rounded-full bg-white/20 hover:bg-white/40 transition"
              )}
              aria-label={`Show ${item.title}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
