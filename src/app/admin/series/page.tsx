"use client";
import { useState } from "react";
import { columns, SerieItem } from "./columns";
import { DataTable } from "../../../components/data-table";
import { Input } from "@/components/ui/input";
import { useSeries } from "@/hooks/serie/use-series";
import { Serie } from "@/models/serie";
import { Button } from "@/components/ui/button";
import { CirclePlus, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useDebounce } from "use-debounce";

export default function SeriesPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 500);
  const [pageIndex, setPageIndex] = useState(1);

  const { data: seriesData } = useSeries({
    search: debouncedSearch,
    sortBy: "name",
    pageIndex: pageIndex,
    pageSize: 10,
  });

  const totalPage = seriesData?.total
    ? Math.ceil(seriesData.total / seriesData.pageSize)
    : 0;

  const canPreviousPage = (pageIndex ?? 1) > 1;
  const canNextPage = (pageIndex ?? 1) < totalPage;

  const data: SerieItem[] =
    seriesData?.data.map((serie: Serie) => ({
      id: serie.id,
      name: serie.name,
      country: serie.countryIso ?? "Unknown",
      year: serie.firstAirDate ? new Date(serie.firstAirDate).getFullYear() : 0,
      posterUrl: serie.posterPath ?? "",
      status: serie.lastAirDate ? "Completed" : "Ongoing",
    })) || [];

  return (
    <>
      <div>
        <h6>Series</h6>
        <p className="text-sm text-muted-foreground">
          Manage your series collection
        </p>
      </div>

      <div className="flex items-center space-x-2 mb-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search series..."
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button
          variant="outline"
          className="border-dashed"
          onClick={() => router.push("/admin/series/create")}
        >
          <CirclePlus className="mr-0.5 h-4 w-4" />
          Create
        </Button>
      </div>
      <div className="container mx-auto">
        <DataTable columns={columns} data={data} />
        <div className="flex items-center justify-end space-x-2 py-4">
          <div className="flex w-[100px] items-center justify-center text-sm font-medium">
            Page {seriesData?.pageIndex} of {totalPage}
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
