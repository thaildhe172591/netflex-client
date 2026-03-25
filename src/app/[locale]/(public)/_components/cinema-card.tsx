"use client";

import { Badge } from "@/components/ui/badge";
import { Movie } from "@/models";
import { generateSlug } from "@/lib/slug";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useLoadingStore } from "@/stores/loading-store";

interface CinemaCardProps {
    movie: Movie;
}

export function CinemaCard({ movie }: CinemaCardProps) {
    const router = useRouter();
    const movieSlug = generateSlug(movie.id, movie.title);
    const startRouteLoading = useLoadingStore((state) => state.startRouteLoading);

    const handleClick = () => {
        startRouteLoading();
        router.push(`/movies/${movieSlug}`);
    };

    return (
        <div
            className="group relative flex cursor-pointer select-none h-full min-w-[280px] sm:min-w-[340px] md:min-w-[400px] overflow-hidden rounded-xl bg-[#111] transition-transform duration-300 hover:z-20 hover:-translate-y-2 hover:shadow-[0_12px_30px_rgba(0,0,0,0.6)]"
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
            {/* Backdrop Area */}
            <div className="relative w-full aspect-[16/9] md:aspect-[2/1] overflow-hidden border border-white/5 bg-background/50 rounded-xl">
                <Image
                    src={movie.backdropPath || "/placeholder.png"}
                    alt={movie.title}
                    fill
                    unoptimized
                    sizes="(max-width: 640px) 280px, (max-width: 1024px) 340px, 400px"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                />

                {/* Bottom dark gradient for text legibility */}
                <div className="absolute inset-x-0 bottom-0 h-[60%] bg-gradient-to-t from-black/95 via-black/40 to-transparent pointer-events-none" />

                {/* Glare effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/0 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                {/* Badge HD/PD overlay on backdrop (top right) */}
                <div className="absolute top-2 right-2 z-10 flex gap-1">
                    <Badge variant="secondary" className="bg-black/60 backdrop-blur-sm text-xs border-white/10 text-white/90">
                        HD
                    </Badge>
                </div>
            </div>

            {/* Content Overflowing over the backdrop */}
            <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 flex items-end gap-3 z-10 translate-y-1 group-hover:translate-y-0 transition-transform duration-300">

                {/* Mini Poster */}
                <div className="relative w-[50px] sm:w-[65px] aspect-[2/3] shrink-0 rounded border border-white/20 shadow-[0_4px_12px_rgba(0,0,0,0.5)] overflow-hidden transition-transform duration-300 group-hover:-translate-y-1">
                    <Image
                        src={movie.posterPath || "/placeholder.png"}
                        alt={movie.title}
                        fill
                        unoptimized
                        sizes="70px"
                        className="object-cover"
                    />
                </div>

                {/* Text Metadata */}
                <div className="flex-1 pb-1">
                    {/* If we had logo we could show it, but title text is safer */}
                    <h3 className="text-sm sm:text-base font-bold text-white line-clamp-1 group-hover:text-primary transition-colors flex items-center">
                        {movie.title}
                    </h3>

                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground mt-0.5">
                        {movie.releaseDate && <span>{new Date(movie.releaseDate).getFullYear()}</span>}
                        {movie.releaseDate && <span className="text-white/30">•</span>}
                        <span>Movie</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
