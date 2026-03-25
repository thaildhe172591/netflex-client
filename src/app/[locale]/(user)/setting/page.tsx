"use client";

import { useAuth } from "@/hooks/use-auth";
import { useMovies } from "@/hooks/movie/use-movies";
import { MovieCard } from "@/app/[locale]/(public)/movies/_components/movie-card";
import { MovieCardSkeleton } from "@/app/[locale]/(public)/movies/_components/movie-card-skeleton";
import { Badge } from "@/components/ui/badge";
import { useTranslations } from "next-intl";

export default function SettingPage() {
  const t = useTranslations("Settings");
  const { data: user } = useAuth();
  const { data: moviesData, isLoading } = useMovies({
    sortby: "averageRating.desc",
    pageSize: 6,
  });
  const movies = moviesData?.data || [];

  const tasteSegments = [
    { label: t("genres.sci_fi"), value: 28, color: "#3b82f6" },
    { label: t("genres.thriller"), value: 22, color: "#22c55e" },
    { label: t("genres.drama"), value: 18, color: "#f59e0b" },
    { label: t("genres.mystery"), value: 16, color: "#a78bfa" },
    { label: t("genres.animation"), value: 16, color: "#38bdf8" },
  ];

  const watchTimeline = [
    {
      title: "Midnight Signal",
      detail: t("paused_at", { time: "00:42:18", ago: "2 hours ago" }), // Note: 'ago' should ideally be localized too, but for now we follow the template
    },
    {
      title: "Aurora Heist",
      detail: t("finished", { ago: "Yesterday" }),
    },
    {
      title: "Glass Horizon",
      detail: t("next_up", { detail: "Season 2, Ep 3" }),
    },
  ];

  const tasteGradient = tasteSegments
    .reduce((acc, segment) => {
      const start = acc.total;
      const end = start + segment.value;
      acc.total = end;
      acc.stops.push(
        `${segment.color} ${start}% ${end}%`
      );
      return acc;
    }, { total: 0, stops: [] as string[] })
    .stops.join(", ");

  return (
    <div className="space-y-10">
      <section className="glass-panel-strong rounded-3xl p-6 md:p-8">
        <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">
          {t("profile_taste")}
        </p>
        <h1 className="text-2xl md:text-3xl font-display font-semibold mt-2">
          {t("welcome_back")}{user?.email ? `, ${user.email}` : ""}
        </h1>
        <p className="text-sm text-muted-foreground mt-2">
          {t("dashboard_sub")}
        </p>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="glass-panel rounded-3xl p-6">
          <h2 className="text-lg font-semibold font-display">{t("watch_history")}</h2>
          <div className="mt-4 space-y-4">
            {watchTimeline.map((item) => (
              <div
                key={item.title}
                className="flex items-start gap-3 border border-white/10 rounded-2xl bg-white/5 p-4"
              >
                <div className="mt-1 h-2 w-2 rounded-full bg-primary" />
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {item.title}
                  </p>
                  <p className="text-xs text-muted-foreground">{item.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-panel rounded-3xl p-6">
          <h2 className="text-lg font-semibold font-display">{t("taste_graph")}</h2>
          <div className="mt-4 flex items-center gap-6">
            <div
              className="h-40 w-40 rounded-full border border-white/10"
              style={{
                background: `conic-gradient(${tasteGradient})`,
              }}
            />
            <div className="space-y-2 text-xs text-muted-foreground">
              {tasteSegments.map((segment) => (
                <div key={segment.label} className="flex items-center gap-2">
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: segment.color }}
                  />
                  <span className="text-foreground">{segment.label}</span>
                  <span>{segment.value}%</span>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {tasteSegments.map((segment) => (
              <Badge
                key={segment.label}
                variant="outline"
                className="border-white/10 bg-white/5 text-foreground/80"
              >
                {segment.label}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold font-display">{t("resume_watching")}</h2>
          <p className="text-xs text-muted-foreground">
            {t("curated_sessions")}
          </p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
          {isLoading
            ? Array.from({ length: 6 }).map((_, index) => (
              <MovieCardSkeleton key={index} />
            ))
            : movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
        </div>
      </section>
    </div>
  );
}
