"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Play, Info } from "lucide-react";
import { useMovies } from "@/hooks/movie/use-movies";
import { StaggerGridItem } from "@/components/feedback/stagger-grid-item";
import { Movie } from "@/models";
import { generateSlug } from "@/lib/slug";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

export function AnimeSection() {
    const t = useTranslations("Anime");
    const { data: animeData, isLoading } = useMovies({
        sortby: "firstAirDate.desc",
        pageSize: 15,
    });

    const animes: Movie[] = Array.isArray(animeData?.data) ? animeData.data : [];
    const [activeAnime, setActiveAnime] = useState<Movie | null>(null);

    useEffect(() => {
        if (animes.length > 0 && !activeAnime) {
            setActiveAnime(animes[0]);
        }
    }, [animes, activeAnime]);

    return (
        <section className="space-y-4 px-4 sm:px-6 lg:px-8 mt-12">
            <h2 className="text-xl md:text-2xl font-bold font-display tracking-tight text-foreground flex items-center gap-2">
                {t("section_title")}
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/10 text-[10px] text-muted-foreground border border-white/10">
                    &gt;
                </span>
            </h2>

            <div className="relative mt-4 w-full overflow-hidden rounded-[40px] bg-[#0c0c0c] ring-1 ring-white/10 lg:aspect-[24/10] group">
                {/* 1. Abstract Background pattern - Halftone / Dotted Mesh - DENSER */}
                <div
                    className="absolute inset-0 pointer-events-none z-0 opacity-[0.2]"
                    style={{
                        backgroundImage: `radial-gradient(circle, #ffffff 1px, transparent 1px)`,
                        backgroundSize: '10px 10px'
                    }}
                />

                {/* 2. Big Hero Image with intense masking */}
                <div className="absolute right-[-2%] top-0 bottom-0 w-[70%] lg:w-[80%] select-none pointer-events-none z-0 opacity-100 transition-opacity duration-500 ease-in-out">
                    {activeAnime && (
                        <Image
                            key={activeAnime.id} // force re-render for fade effect (handled by next image or CSS)
                            src={activeAnime.backdropPath || activeAnime.posterPath || "https://media.themoviedb.org/t/p/original/mSXzIol9XNl0G23yYj0yT93C3Lq.jpg"}
                            alt={activeAnime.title}
                            className="object-cover object-center lg:object-right mask-image-cinema-hero animate-in fade-in duration-700"
                            fill
                            unoptimized
                        />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-l from-transparent via-[#0c0c0c]/40 to-[#0c0c0c] pointer-events-none" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0c] via-transparent to-transparent pointer-events-none" />
                </div>

                {/* 3. Content Side - True Cinematic Typography */}
                <div className="relative z-10 flex h-full w-full flex-col justify-start px-8 pt-12 pb-[200px] lg:w-[45%] xl:w-[50%] lg:px-14 xl:px-20 lg:pt-16 lg:pb-[240px]">
                    {activeAnime && (
                        <div className="animate-in slide-in-from-left-4 fade-in duration-500" key={`content-${activeAnime.id}`}>
                            <div className="space-y-1 mb-6 mt-2">
                                <h1
                                    className="text-[34px] sm:text-[42px] lg:text-[48px] text-white font-medium drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)] leading-[1.15] tracking-wide line-clamp-2"
                                    style={{ fontFamily: '"Comic Sans MS", "Chalkboard SE", "Comic Neue", sans-serif' }}
                                >
                                    {activeAnime.title}
                                </h1>
                                <p className="text-[10px] sm:text-xs font-sans font-bold text-[#10B981] uppercase tracking-[0.15em] mt-2 opacity-90 drop-shadow-md">
                                    {activeAnime.title}
                                </p>
                            </div>

                            <div className="mb-6 flex flex-wrap items-center gap-2 drop-shadow-md">
                                <div className="flex items-center ring-1 ring-[#10B981] text-[#10B981] bg-transparent text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider backdrop-blur-sm mr-1">
                                    IMDb {activeAnime.averageRating ? activeAnime.averageRating.toFixed(1) : "0"}
                                </div>
                                <span className="px-2 py-0.5 rounded-full ring-1 ring-white/20 bg-transparent text-[10px] uppercase font-bold tracking-widest text-white/80 backdrop-blur-sm">
                                    {activeAnime.releaseDate ? new Date(activeAnime.releaseDate).getFullYear() : "2024"}
                                </span>
                                <span className="px-2 py-0.5 rounded-full ring-1 ring-white/20 bg-transparent text-[10px] uppercase font-bold tracking-widest text-white/80 backdrop-blur-sm">
                                    {t("part")} 1
                                </span>
                            </div>

                            <div className="mb-6 flex flex-wrap gap-2.5 drop-shadow-md">
                                {[
                                    t("categories.anime"),
                                    t("categories.action"),
                                    t("categories.adventure"),
                                ].map((tag) => (
                                    <span key={tag} className="text-[10px] font-black uppercase tracking-widest text-white/60 bg-[#222]/50 hover:bg-white/10 transition-all cursor-pointer px-3 py-1.5 rounded-md hover:text-white backdrop-blur-md">
                                        {tag}
                                    </span>
                                ))}
                            </div>

                            <p className="mb-8 max-w-[500px] text-[13px] sm:text-[14px] leading-relaxed text-white/80 drop-shadow-lg font-medium line-clamp-3 tracking-wide shadow-black">
                                {activeAnime.overview || "..."}
                            </p>
                        </div>
                    )}
                </div>

                {/* Left Gradient Cover for scroll bleeding effect */}
                <div className="absolute bottom-0 left-0 w-[60%] md:w-[40%] lg:w-[35%] h-[240px] bg-gradient-to-r from-[#0c0c0c] via-[#0c0c0c]/90 to-transparent z-30 pointer-events-none" />

                {/* Play Buttons - Fixed position on the left */}
                {activeAnime && (
                    <div className="absolute bottom-10 sm:bottom-12 left-8 lg:left-14 xl:left-20 z-40 flex items-center gap-4 sm:gap-6 animate-in slide-in-from-bottom-4 fade-in duration-500" key={`action-${activeAnime.id}`}>
                        <Link href={`/movies/${generateSlug(activeAnime.id, activeAnime.title)}`}>
                            <button
                                className="group/play flex h-14 w-14 sm:h-[64px] sm:w-[64px] items-center justify-center rounded-full bg-[#10B981] transition-all hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(16,185,129,0.4)] hover:shadow-[0_0_50px_rgba(16,185,129,0.6)] relative overflow-hidden"
                                title={t("play")}
                            >
                                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/play:translate-y-0 transition-transform duration-300" />
                                <Play className="h-6 w-6 sm:h-7 sm:w-7 fill-black text-black relative z-10 translate-x-0.5" />
                            </button>
                        </Link>
                        <button
                            className="flex h-10 w-10 sm:h-[48px] sm:w-[48px] items-center justify-center rounded-full bg-white/5 text-white transition-all hover:bg-white/10 hover:scale-105 active:scale-95 group/info backdrop-blur-md ring-1 ring-white/20 hover:ring-white/40 shadow-lg relative overflow-hidden"
                            title={t("info")}
                        >
                            <Info className="h-5 w-5 sm:h-5 sm:w-5 opacity-80 group-hover:opacity-100 relative z-10" />
                        </button>
                    </div>
                )}

                {/* 4. Small Rail overlayting bottom edge - TV UI scrolling - CONTAINED */}
                <div className="absolute bottom-4 sm:bottom-6 left-0 right-0 z-20 pointer-events-auto" onMouseLeave={() => { }}>
                    <div className="flex gap-2.5 sm:gap-3 md:gap-4 overflow-x-auto scrollbar-hide select-none items-end h-[200px] pt-10 pb-5 px-8 lg:px-14 xl:px-14">
                        {/* Clear Action Buttons Area */}
                        <div className="shrink-0 w-[120px] sm:w-[150px] lg:w-[220px] xl:w-[260px]" />

                        {isLoading
                            ? Array.from({ length: 12 }).map((_, i) => (
                                <div key={i} className="w-[60px] sm:w-[75px] md:w-[90px] flex-none">
                                    <div className="aspect-[2/3] bg-white/5 animate-pulse rounded-lg" />
                                </div>
                            ))
                            : animes.map((anime, index) => (
                                <div
                                    key={anime.id}
                                    className={cn(
                                        "w-[60px] sm:w-[75px] md:w-[90px] flex-none transition-all duration-300 cursor-pointer shadow-xl",
                                        activeAnime?.id === anime.id
                                            ? "scale-[1.12] origin-bottom z-30 brightness-110 -translate-y-1 ring-2 ring-[#10B981] rounded-lg shadow-[0_10px_20px_rgba(0,0,0,0.8)]"
                                            : "opacity-60 brightness-75 hover:opacity-100 hover:brightness-100 hover:scale-[1.05] hover:-translate-y-1 rounded-lg origin-bottom"
                                    )}
                                    onClick={() => setActiveAnime(anime)}
                                >
                                    <StaggerGridItem index={index}>
                                        <Image
                                            src={anime.posterPath || "/placeholder.png"}
                                            alt={anime.title}
                                            width={90}
                                            height={135}
                                            className="rounded-lg object-cover ring-1 ring-white/10 aspect-[2/3] w-full bg-white/5 backdrop-blur-sm shadow-black/40 shadow-inner"
                                            unoptimized
                                        />
                                    </StaggerGridItem>
                                </div>
                            ))}

                        {/* Trailing spacer */}
                        <div className="shrink-0 w-8" />
                    </div>
                </div>
            </div>
        </section>
    );
}
