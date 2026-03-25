"use client";

import { Movie } from "@/models";
import { generateSlug } from "@/lib/slug";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useLoadingStore } from "@/stores/loading-store";

interface Top10CardProps {
    movie: Movie;
    rank: number;
}

export function Top10Card({ movie, rank }: Top10CardProps) {
    const router = useRouter();
    const movieSlug = generateSlug(movie.id, movie.title);
    const startRouteLoading = useLoadingStore((state) => state.startRouteLoading);

    const handleClick = () => {
        startRouteLoading();
        router.push(`/movies/${movieSlug}`);
    };

    return (
        <div
            className="group relative flex cursor-pointer select-none items-center justify-end h-full min-w-[160px] sm:min-w-[190px] md:min-w-[210px] pl-[60px] sm:pl-[80px]"
            role="button"
            tabIndex={0}
            onClick={handleClick}
            onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    handleClick();
                }
            }}
        >
            {/* Huge number in background (SVG outline text with dark fill) */}
            <div className={`absolute left-0 bottom-0 top-0 flex flex-col justify-end overflow-hidden pointer-events-none z-0 ${rank >= 10 ? 'w-[140px] sm:w-[170px] -ml-6' : 'w-[110px] sm:w-[130px]'}`}>
                <svg
                    viewBox={rank >= 10 ? "0 0 160 150" : "0 0 100 150"}
                    className="h-auto w-full origin-bottom-left transition-all duration-500 group-hover:-translate-x-1 group-hover:-translate-y-1 drop-shadow-[0_0_15px_rgba(16,185,129,0.2)] group-hover:drop-shadow-[0_0_25px_rgba(16,185,129,0.4)]"
                    preserveAspectRatio="xMidYMax meet"
                    style={{ marginBottom: "-5%" }}
                >
                    <defs>
                        <linearGradient id={`gradientStroke-${rank}`} x1="0%" y1="0%" x2="0%" y2="100%">
                            {/* Emerald/Primary Theme Gradient */}
                            <stop offset="0%" stopColor="#10b981" /> {/* Tailwind emerald-500 */}
                            <stop offset="50%" stopColor="rgba(16, 185, 129, 0.4)" />
                            <stop offset="100%" stopColor="rgba(16, 185, 129, 0.05)" />
                        </linearGradient>
                    </defs>
                    <text
                        x={rank >= 10 ? "0" : "-10"}
                        y="150"
                        fontSize="200"
                        fontWeight="900"
                        fontFamily="'Inter', 'Impact', sans-serif"
                        fill="#0A0A0A"
                        stroke={`url(#gradientStroke-${rank})`}
                        strokeWidth="4"
                        strokeLinejoin="round"
                        style={{ letterSpacing: "-0.05em" }}
                    >
                        {rank}
                    </text>
                </svg>
            </div>

            {/* Poster over the number with glassmorphic overlap drop shadow */}
            <div className="relative z-10 w-[110px] sm:w-[130px] md:w-[145px] aspect-[2/3] overflow-hidden rounded-xl border border-white/10 shadow-[0_4px_24px_rgba(0,0,0,0.8)] transition-all duration-300 group-hover:scale-105 group-hover:-translate-y-3 group-hover:shadow-[0_15px_30px_-5px_rgba(255,255,255,0.15)] group-hover:border-white/30 bg-[#111]">
                <Image
                    src={movie.posterPath || "/placeholder.png"}
                    alt={movie.title}
                    fill
                    unoptimized
                    sizes="(max-width: 640px) 45vw, (max-width: 1024px) 25vw, 160px"
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                />

                {/* Inner glare effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/0 to-white/0 group-hover:to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                {/* Bottom gradient fade for text legibility (if any) */}
                <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 pointer-events-none" />
            </div>
        </div>
    );
}
