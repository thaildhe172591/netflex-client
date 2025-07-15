"use client";
import { useState } from "react";
import { columns, GenreItem } from "./columns";
import { DataTable } from "./data-table";
import { Input } from "@/components/ui/input";
import { useGenres } from "./_hooks/use-genre";
import { Genre } from "@/models";
import { CreateGenreDialog } from "./_components/create-genre-dialog";
import { Search } from "lucide-react";
import { useDebounce } from "@/hooks/use-debounce";
import { Button } from "@/components/ui/button";

export default function Page() {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [pageIndex, setPageIndex] = useState(1);

  const { data: genresData } = useGenres({
    search: debouncedSearch,
    sortBy: "name",
    pageIndex: pageIndex,
    pageSize: 10,
  });

  const totalPage = genresData?.total
    ? Math.ceil(genresData.total / genresData.pageSize)
    : 0;

  const canPreviousPage = (pageIndex ?? 1) > 1;
  const canNextPage = (pageIndex ?? 1) < totalPage;

  const data: GenreItem[] =
    genresData?.data.map((genre: Genre) => ({
      id: genre.id,
      name: genre.name,
    })) || [];

  return (
    <>
      <div>
        <h6>Genres</h6>
        <p className="text-sm text-muted-foreground">
          Manage your genre collection
        </p>
      </div>

      <div className="flex items-center space-x-2 mb-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search genres..."
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <CreateGenreDialog />
      </div>
      <div className="container mx-auto">
        <DataTable columns={columns} data={data} />
        <div className="flex items-center justify-end space-x-2 py-4">
          <div className="flex w-[100px] items-center justify-center text-sm font-medium">
            Page {genresData?.pageIndex} of {totalPage}
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
