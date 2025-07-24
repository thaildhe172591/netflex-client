"use client";
import { useState } from "react";
import { columns, MovieItem } from "./columns";
import { DataTable } from "./data-table";
import { Input } from "@/components/ui/input";
import { useMovies } from "@/hooks/movie/use-movies";
import { Movie } from "@/models";
import { CreateMovieDialog } from "./_components/create-movie-dialog";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDebounce } from "use-debounce";

export default function Page() {
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 500);
  const [pageIndex, setPageIndex] = useState(1);

  const { data: moviesData } = useMovies({
    search: debouncedSearch,
    sortby: "release_date",
    pageIndex: pageIndex,
    pageSize: 10,
  });

  const totalPage = moviesData?.total
    ? Math.ceil(moviesData.total / moviesData.pageSize)
    : 0;

  const canPreviousPage = (pageIndex ?? 1) > 1;
  const canNextPage = (pageIndex ?? 1) < totalPage;

  const data: MovieItem[] =
    moviesData?.data.map((movie: Movie) => ({
      id: movie.id,
      title: movie.title,
      year: movie.releaseDate ? new Date(movie.releaseDate).getFullYear() : 0,
      status: movie.videoUrl ? "Published" : "Coming soon",
      duration: movie.runtime ? `${movie.runtime} min` : "N/A",
      posterUrl: movie.posterPath || "",
    })) || [];

  return (
    <>
      <div>
        <h6>Movies</h6>
        <p className="text-sm text-muted-foreground">
          Manage your movie collection
        </p>
      </div>

      <div className="flex items-center space-x-2 mb-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search movies..."
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <CreateMovieDialog />
      </div>
      <div className="container mx-auto">
        <DataTable columns={columns} data={data} />
        <div className="flex items-center justify-end space-x-2 py-4">
          <div className="flex w-[100px] items-center justify-center text-sm font-medium">
            Page {moviesData?.pageIndex} of {totalPage}
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
      </div>
    </>
  );
}
