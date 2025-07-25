"use client";

import { useSeries } from "@/hooks/serie/use-series";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, SearchX } from "lucide-react";
import { SerieCard } from "@/app/(public)/series/_components/serie-card";
import { SerieGridSkeleton } from "@/app/(public)/series/_components/serie-card-skeleton";
import { GenreFilter } from "@/app/(public)/_components/genre-filter";
import { CountryFilter } from "@/app/(public)/_components/country-filter";
import { YearFilter } from "@/app/(public)/_components/year-filter";
import { SortBy } from "@/app/(public)/series/_components/sort-by";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";

export default function Page() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("query") || "");
  const [selectedGenres, setSelectedGenres] = useState<number[]>(
    searchParams.get("genres")?.split(",").filter(Boolean).map(Number) || []
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
    if (!pathname.includes("/series/")) return;
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

  const { data: seriesData, isLoading } = useSeries({
    search: debouncedSearch,
    pageIndex,
    pageSize: 24,
    sortBy: selectedSort || "first_air_date.desc",
    genres: selectedGenres,
    country: selectedCountry || undefined,
    year: selectedYear || undefined,
  });

  const totalPage = seriesData?.total
    ? Math.ceil(seriesData.total / seriesData.pageSize)
    : 0;

  const canPreviousPage = pageIndex > 1;
  const canNextPage = pageIndex < totalPage;

  const handleGenreSelect = (genreId: number) => {
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 w-full mb-2.5">
        <div className="relative flex-1 w-full m-0">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search TV series..."
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div>
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
      </div>

      {isLoading ? (
        <SerieGridSkeleton count={24} />
      ) : (
        <>
          {seriesData?.data && seriesData.data.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 mb-0">
              {seriesData.data.map((serie) => (
                <SerieCard key={serie.id} serie={serie} />
              ))}
            </div>
          )}

          {seriesData?.data && seriesData.data.length === 0 && (
            <div className="text-muted-foreground text-sm flex items-center gap-2">
              <SearchX className="!size-4" />
              No TV series found
            </div>
          )}

          {seriesData?.data && seriesData.data.length > 0 && (
            <div className="flex items-center justify-end gap-2 py-4">
              <div className="flex items-center justify-center text-sm font-medium">
                Page {pageIndex} of {totalPage}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPageIndex(pageIndex - 1)}
                disabled={!canPreviousPage}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPageIndex(pageIndex + 1)}
                disabled={!canNextPage}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
