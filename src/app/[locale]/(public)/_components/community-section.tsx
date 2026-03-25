"use client";

import Image from "next/image";
import { TrendingUp, MessageSquare, Heart, Clock, Film } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { useTranslations } from "next-intl";

export function CommunitySection() {
    const t = useTranslations("Community");

    // Mock data for Top Comments
    const topComments = [
        {
            id: 1,
            name: "Trực Ngọc",
            role: t("roles.audience"),
            content: "Lag quá ad uiii 🥺",
            likes: 12,
            replies: 0,
            movieImg: "https://media.themoviedb.org/t/p/w200/kSWeEokZl7lqVqJ4Qz8S3g4M7E.jpg",
            movieTitle: "Trực Ngọc",
        },
        {
            id: 2,
            name: "kkk",
            role: t("roles.hardcore_fan"),
            content: "Lỗi rồi",
            likes: 56,
            replies: 12,
            movieImg: "https://media.themoviedb.org/t/p/w200/xA1m79iJqMIfZzKz4W6iW5QzY7q.jpg",
            movieTitle: "Thần Đèn Cỡ, Ước Đi",
        },
        {
            id: 3,
            name: "Tín",
            role: t("roles.vip"),
            content: "Quá hay! Tuyệt phẩm 2025.",
            likes: 120,
            replies: 5,
            movieImg: "https://media.themoviedb.org/t/p/w200/t6HIqrO2zJWqA0uE5o4Q82JpT8u.jpg",
            movieTitle: "Đêm Ngày Xa Mẹ",
        },
        {
            id: 4,
            name: "Phan Huỳnh Anh Thư",
            role: t("roles.member"),
            content: "Hay xuất sắc lun.",
            likes: 89,
            replies: 1,
            movieImg: "https://media.themoviedb.org/t/p/w200/x7uAFL38n3A8yJb8cE9qH0i4b8q.jpg",
            movieTitle: "Tiếng Yêu Này",
        },
    ];

    // Mock data for Hot Lists
    const hotList = [
        { id: 1, title: "Trực Ngọc", isUp: true },
        { id: 2, title: "Tiếng Yêu Này Anh Dịch Được Không?", isUp: true },
        { id: 3, title: "Trao Em Cả Vũ Trụ", isUp: false },
        { id: 4, title: "Phi Vụ Động Trời 2", isUp: true },
        { id: 5, title: "Song Quỷ", isUp: true },
    ];

    // Mock array for Genres (Note: ideally these should be fetched or translated from common list)
    const genres = [
        { name: "Chính kịch", color: "bg-red-500/20 text-red-500" },
        { name: "Tâm lý", color: "bg-blue-500/20 text-blue-500" },
        { name: "Tình cảm", color: "bg-green-500/20 text-green-500" },
        { name: "Hài hước", color: "bg-yellow-500/20 text-yellow-500" },
        { name: "Hành động", color: "bg-purple-500/20 text-purple-500" },
    ];

    return (
        <section className="px-4 sm:px-6 lg:px-8 mt-12 mb-16">
            <div className="rounded-[40px] bg-[#111] p-6 text-foreground shadow-2xl ring-1 ring-white/10 md:p-10 relative overflow-hidden">
                {/* Decoration background */}
                <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-[#E5B537]/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />

                {/* Header Carousel - Top Bình Luận */}
                <div className="relative z-10 mb-12">
                    <div className="mb-6 flex items-center justify-between">
                        <div className="flex items-center gap-3 font-black uppercase tracking-widest text-[#E5B537] text-sm">
                            <span className="h-1 w-8 bg-[#E5B537] rounded-full" />
                            <MessageSquare className="h-5 w-5 fill-[#E5B537]/20" />
                            {t("title")}
                        </div>
                        <button className="text-[10px] uppercase tracking-widest text-muted-foreground hover:text-white transition-colors">
                            {t("view_all")}
                        </button>
                    </div>

                    <div className="edge-fade flex gap-6 overflow-x-auto scrollbar-hide py-4 px-1">
                        {topComments.map((comment) => (
                            <div
                                key={comment.id}
                                className="group relative flex min-w-[320px] flex-none cursor-pointer flex-col justify-between overflow-hidden rounded-[24px] bg-white/[0.03] backdrop-blur-xl p-5 shadow-2xl ring-1 ring-white/10 transition-all hover:bg-white/[0.07] hover:ring-white/30 hover:-translate-y-1"
                            >
                                <div className="relative z-10 flex gap-4">
                                    <div className={cn(
                                        "h-12 w-12 shrink-0 overflow-hidden rounded-full p-0.5",
                                        comment.role === t("roles.vip") ? "bg-gradient-to-tr from-purple-500 to-pink-500 ring-2 ring-purple-500/50 shadow-[0_0_15px_rgba(236,72,153,0.3)]" :
                                            comment.role === t("roles.hardcore_fan") ? "bg-gradient-to-tr from-blue-400 to-cyan-400 ring-2 ring-blue-400/50" :
                                                "bg-gradient-to-tr from-[#E5B537] to-amber-200 ring-2 ring-[#E5B537]/50"
                                    )}>
                                        <div className="h-full w-full rounded-full bg-[#222]" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <h4 className="font-bold text-white text-sm tracking-tight">{comment.name}</h4>
                                            <span className={cn(
                                                "text-[9px] font-black uppercase tracking-tighter px-1.5 py-0.5 rounded",
                                                comment.role === t("roles.vip") ? "bg-purple-500/20 text-purple-400" :
                                                    comment.role === t("roles.hardcore_fan") ? "bg-blue-500/20 text-blue-400" :
                                                        "bg-[#E5B537]/20 text-[#E5B537]"
                                            )}>
                                                {comment.role}
                                            </span>
                                        </div>
                                        <p className="mt-2 text-xs leading-relaxed text-muted-foreground line-clamp-2 italic font-light">
                                            "{comment.content}"
                                        </p>
                                    </div>
                                    {/* Miniature Poster with Glow */}
                                    <div className="relative h-20 w-14 shrink-0 overflow-hidden rounded-lg shadow-xl ring-1 ring-white/20 transition-transform group-hover:scale-105 group-hover:rotate-2">
                                        <Image
                                            src={comment.movieImg}
                                            alt={comment.movieTitle}
                                            width={56}
                                            height={80}
                                            className="h-full w-full object-cover"
                                            unoptimized
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                    </div>
                                </div>
                                <div className="relative z-10 mt-5 flex items-center justify-between">
                                    <div className="flex items-center gap-4 text-[10px] font-bold tracking-widest text-white/40 uppercase">
                                        <span className="flex items-center gap-1.5 hover:text-red-500 transition-colors">
                                            <Heart className="h-3 w-3 fill-current" /> {comment.likes}
                                        </span>
                                        <span className="flex items-center gap-1.5 hover:text-[#E5B537] transition-colors">
                                            <MessageSquare className="h-3 w-3 fill-current" /> {comment.replies}
                                        </span>
                                    </div>
                                    <span className="text-[10px] text-white/20 font-medium truncate max-w-[100px]">
                                        {comment.movieTitle}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 4 Grid Columns - Re-designed with Ranking colors */}
                <div className="relative z-10 grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4 lg:gap-14 mt-12 border-t border-white/5 pt-10">

                    {/* Col 1: Sôi Nổi Nhất */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3 font-bold uppercase text-white tracking-widest text-xs">
                            <div className="p-2 rounded-lg bg-red-500/10 text-red-500 ring-1 ring-red-500/20">
                                <TrendingUp className="h-4 w-4" />
                            </div>
                            {t("hot")}
                        </div>
                        <div className="space-y-2">
                            {hotList.map((item, i) => (
                                <div key={i} className="group relative flex cursor-pointer items-center justify-between rounded-xl px-3 py-2.5 transition-all hover:bg-white/[0.04]">
                                    <div className="flex items-center gap-4 relative z-10">
                                        <span className={cn(
                                            "w-6 text-sm font-black italic",
                                            i === 0 ? "text-transparent bg-clip-text bg-gradient-to-br from-yellow-300 to-amber-600 drop-shadow-[0_2px_4px_rgba(251,191,36,0.3)]" :
                                                i === 1 ? "text-transparent bg-clip-text bg-gradient-to-br from-slate-200 to-slate-400" :
                                                    i === 2 ? "text-transparent bg-clip-text bg-gradient-to-br from-orange-300 to-orange-600" :
                                                        "text-muted-foreground"
                                        )}>
                                            {String(i + 1).padStart(2, "0")}
                                        </span>
                                        <span className="text-sm font-medium text-white/80 transition-colors group-hover:text-primary line-clamp-1 max-w-[160px]">
                                            {item.title}
                                        </span>
                                    </div>
                                    <div className="opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0 relative z-10">
                                        <TrendingUp className={cn("h-3 w-3", item.isUp ? "text-green-500" : "text-red-500 rotate-180")} />
                                    </div>
                                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Col 2: Yêu Thích Nhất */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3 font-bold uppercase text-white tracking-widest text-xs">
                            <div className="p-2 rounded-lg bg-pink-500/10 text-pink-500 ring-1 ring-pink-500/20">
                                <Heart className="h-4 w-4" />
                            </div>
                            {t("favorite")}
                        </div>
                        <div className="space-y-2">
                            {hotList.slice().reverse().map((item, i) => (
                                <div key={i} className="group flex cursor-pointer items-center gap-4 rounded-xl px-3 py-2.5 transition-colors hover:bg-white/[0.04]">
                                    <span className={cn(
                                        "w-6 text-sm font-black italic",
                                        i === 0 ? "text-transparent bg-clip-text bg-gradient-to-br from-yellow-300 to-amber-600" :
                                            i === 1 ? "text-transparent bg-clip-text bg-gradient-to-br from-slate-200 to-slate-400" :
                                                i === 2 ? "text-transparent bg-clip-text bg-gradient-to-br from-orange-300 to-orange-600" :
                                                    "text-muted-foreground"
                                    )}>
                                        {String(i + 1).padStart(2, "0")}
                                    </span>
                                    <span className="text-sm font-medium text-white/80 transition-colors group-hover:text-pink-400 line-clamp-1 max-w-[180px]">
                                        {item.title}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Col 3: Thể Loại Hot */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3 font-bold uppercase text-white tracking-widest text-xs">
                            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500 ring-1 ring-blue-500/20">
                                <Film className="h-4 w-4" />
                            </div>
                            {t("hot_genre")}
                        </div>
                        <div className="grid grid-cols-1 gap-2">
                            {genres.map((genre, i) => (
                                <div key={i} className="group flex cursor-pointer items-center justify-between rounded-xl px-3 py-2.5 transition-colors hover:bg-white/[0.04]">
                                    <div className="flex items-center gap-4">
                                        <span className="w-4 text-[10px] font-bold text-muted-foreground">{i + 1}</span>
                                        <div className={cn("px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ring-1 ring-inset",
                                            genre.color.replace('bg-', 'bg-transparent ring-').replace('text-', 'text-')
                                        )}>
                                            {genre.name}
                                        </div>
                                    </div>
                                    <div className="h-1.5 w-1.5 rounded-full bg-white/20 group-hover:bg-primary transition-colors" />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Col 4: Bình Luận Mới */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3 font-bold uppercase text-white tracking-widest text-xs">
                            <div className="p-2 rounded-lg bg-orange-500/10 text-orange-500 ring-1 ring-orange-500/20">
                                <MessageSquare className="h-4 w-4" />
                            </div>
                            {t("new_comments")}
                        </div>
                        <div className="space-y-4">
                            {topComments.slice(0, 3).map((comment) => (
                                <div key={comment.id} className="group cursor-pointer rounded-2xl bg-white/[0.02] p-4 ring-1 ring-white/5 transition-all hover:bg-white/[0.06] hover:ring-white/10 hover:-translate-y-1">
                                    <div className="flex gap-4">
                                        <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full bg-slate-800 ring-2 ring-white/5" />
                                        <div className="flex-1 overflow-hidden">
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs font-bold text-white/90 truncate mr-2">{comment.name}</span>
                                                <span className="text-[9px] text-muted-foreground shrink-0 uppercase tracking-tighter">{t("time_ago", { time: 7 })}</span>
                                            </div>
                                            <p className="mt-2 text-[11px] text-muted-foreground line-clamp-1 italic">
                                                "{comment.content}"
                                            </p>
                                            <div className="mt-2 flex items-center gap-1.5 text-[9px] font-bold text-primary/80 uppercase tracking-widest">
                                                <Film className="h-2.5 w-2.5" />
                                                <span className="truncate">{comment.movieTitle}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
