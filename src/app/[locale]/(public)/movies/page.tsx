"use client";

import { useMovies } from "@/hooks/movie/use-movies";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Search, Sparkles } from "lucide-react";
import { MovieCard } from "@/app/[locale]/(public)/movies/_components/movie-card";
import { MovieGridSkeleton } from "@/app/[locale]/(public)/movies/_components/movie-card-skeleton";
import { GenreFilter } from "@/app/[locale]/(public)/_components/genre-filter";
import { CountryFilter } from "@/app/[locale]/(public)/_components/country-filter";
import { YearFilter } from "@/app/[locale]/(public)/_components/year-filter";
import { SortBy } from "@/app/[locale]/(public)/movies/_components/sort-by";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import { EmptyResults } from "@/components/feedback/empty-results";
import { StaggerGridItem } from "@/components/feedback/stagger-grid-item";
import { useTranslations } from "next-intl";

export default function Page() {
  const t = useTranslations("Discover");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("query") || "");
  const [selectedGenres, setSelectedGenres] = useState<string[]>(
    searchParams.get("genres")?.split(",").filter(Boolean) || []
  );
  const [selectedCountry, setSelectedCountry] = useState<string>(
    searchParams.get("country") || ""
  );
  const [selectedYear, setSelectedYear] = useState<string>(
    searchParams.get("year") || ""
  );
  const [selectedSort, setSelectedSort] = useState<string>(
    searchParams.get("sortby") || ""
  );
  const [pageIndex, setPageIndex] = useState(
    Number(searchParams.get("page")) || 1
  );
  const [debouncedSearch] = useDebounce(search, 500);

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (!pathname.includes("/movies")) return;
    if (debouncedSearch) {
      params.set("query", debouncedSearch);
    } else {
      params.delete("query");
    }
    if (selectedGenres.length > 0) {
      params.set("genres", selectedGenres.join(","));
    } else {
      params.delete("genres");
    }
    if (selectedCountry) {
      params.set("country", selectedCountry);
    } else {
      params.delete("country");
    }
    if (selectedYear) {
      params.set("year", selectedYear);
    } else {
      params.delete("year");
    }
    if (selectedSort) {
      params.set("sortby", selectedSort);
    } else {
      params.delete("sortby");
    }
    params.set("page", pageIndex.toString());
    router.replace(`${pathname}?${params.toString()}`);
  }, [
    debouncedSearch,
    selectedGenres,
    selectedCountry,
    selectedYear,
    selectedSort,
    pageIndex,
    pathname,
    router,
    searchParams,
  ]);

  const { data: moviesData, isLoading, isFetching } = useMovies({
    search: debouncedSearch,
    pageIndex,
    pageSize: 24,
    sortby: selectedSort || "release_date.desc",
    genres: selectedGenres,
    country: selectedCountry || undefined,
    year: selectedYear || undefined,
  });

  const totalPage = moviesData?.total
    ? Math.ceil(moviesData.total / moviesData.pageSize)
    : 0;
  const movies = Array.isArray(moviesData?.data) ? moviesData.data : [];

  const canPreviousPage = pageIndex > 1;
  const canNextPage = pageIndex < totalPage;

  const handleGenreSelect = (genreId: string) => {
    setSelectedGenres((prev) => {
      if (prev.includes(genreId)) {
        return prev.filter((id) => id !== genreId);
      }
      return [...prev, genreId];
    });
    setPageIndex(1);
  };

  const handleCountrySelect = (countryCode: string) => {
    if (selectedCountry === countryCode) setSelectedCountry("");
    else setSelectedCountry(countryCode);
    setPageIndex(1);
  };

  const handleYearSelect = (year: string) => {
    if (selectedYear === year) setSelectedYear("");
    else setSelectedYear(year);
    setPageIndex(1);
  };

  const handleSortSelect = (sortBy: string) => {
    setSelectedSort(sortBy);
    setPageIndex(1);
  };

  const handleResetDiscover = () => {
    setSearch("");
    setSelectedGenres([]);
    setSelectedCountry("");
    setSelectedYear("");
    setSelectedSort("");
    setPageIndex(1);
  };

  const smartSuggestions = movies.slice(0, 3);

  return (
    <div className="space-y-8">
      <section className="glass-panel-strong rounded-3xl p-6 md:p-8">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">
            {t("search_discovery")}
          </p>
          <h1 className="text-2xl md:text-3xl font-display font-semibold">
            {t("discover_movies")}
          </h1>
          <p className="text-sm text-muted-foreground">
            {t("discover_sub")}
          </p>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t("search_placeholder")}
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {isFetching && (
              <div className="absolute right-3 top-2.5 inline-flex items-center gap-1 text-xs text-muted-foreground">
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                {t("searching")}
              </div>
            )}
          </div>
          <div className="glass-panel rounded-2xl p-4">
            <div className="flex items-center gap-2 text-sm text-foreground">
              <Sparkles className="h-4 w-4 text-primary" />
              {t("ai_suggestions")}
            </div>
            <div className="mt-3 space-y-2 text-xs text-muted-foreground">
              {debouncedSearch && smartSuggestions.length > 0 ? (
                smartSuggestions.map((movie) => (
                  <div
                    key={movie.id}
                    className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-3 py-2"
                  >
                    <span className="line-clamp-1">{movie.title}</span>
                    <span className="text-primary">{t("match")}</span>
                  </div>
                ))
              ) : (
                <p>{t("try_keywords")}</p>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 space-y-3">
          <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
            {t("smart_filters")}
          </div>
          <GenreFilter
            selected={selectedGenres}
            onSelect={handleGenreSelect}
            onClear={() => setSelectedGenres([])}
          />
          <CountryFilter
            selected={selectedCountry}
            onSelect={handleCountrySelect}
            onClear={() => setSelectedCountry("")}
          />
          <YearFilter
            selected={selectedYear}
            onSelect={handleYearSelect}
            onClear={() => setSelectedYear("")}
          />
          <SortBy selected={selectedSort} onSelect={handleSortSelect} />
        </div>
      </section>

      {isLoading ? (
        <MovieGridSkeleton count={24} />
      ) : (
        <>
          {movies.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
              {movies.map((movie, index) => (
                <StaggerGridItem key={movie.id} index={index}>
                  <MovieCard movie={movie} />
                </StaggerGridItem>
              ))}
            </div>
          )}

          {movies.length === 0 && (
            <EmptyResults
              title={t("no_results")}
              description={t("no_results_sub")}
              onAction={handleResetDiscover}
            />
          )}

          {movies.length > 0 && (
            <div className="flex flex-wrap items-center justify-end gap-3 py-4">
              <div className="flex items-center justify-center text-sm font-medium text-muted-foreground">
                {t("pagination", { page: pageIndex, total: totalPage })}
              </div>
              <Button
                variant="outline"
                size="sm"
                className="border-white/10 bg-white/5 text-foreground hover:bg-white/10"
                onClick={() => setPageIndex(pageIndex - 1)}
                disabled={!canPreviousPage}
              >
                {t("previous")}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-white/10 bg-white/5 text-foreground hover:bg-white/10"
                onClick={() => setPageIndex(pageIndex + 1)}
                disabled={!canNextPage}
              >
                {t("next")}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
