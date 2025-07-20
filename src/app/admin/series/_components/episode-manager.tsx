import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { useDebounce } from "@/hooks/use-debounce";
import { Episode } from "@/models/episode";
import { CreateEpisodeDialog } from "./create-episode-dialog";
import { useEpisodes } from "../_hooks/use-episodes";
import { episodeColumns, EpisodeItem } from "./episode-columns";
import { DataTable } from "@/components/data-table";

interface EpisodeManagerProps {
  seriesId: number;
}

export const EpisodeManager: React.FC<EpisodeManagerProps> = ({ seriesId }) => {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [pageIndex, setPageIndex] = useState(1);

  const { data: episodeData } = useEpisodes({
    seriesId,
    search: debouncedSearch,
    pageIndex,
    pageSize: 10,
  });

  const totalPage = episodeData?.total
    ? Math.ceil(episodeData.total / episodeData.pageSize)
    : 0;

  const canPreviousPage = (pageIndex ?? 1) > 1;
  const canNextPage = (pageIndex ?? 1) < totalPage;

  const data: EpisodeItem[] =
    episodeData?.data.map((episode: Episode) => ({
      id: episode.id,
      name: episode.name,
      airDate: episode.airDate
        ? new Date(episode.airDate).toLocaleDateString()
        : "-",
      runtime: episode.runtime ?? "-",
      status: episode.airDate ? "Aired" : "Upcoming",
      serieId: seriesId,
    })) || [];

  return (
    <div>
      <div className="mb-4">
        <h6>Episode</h6>
        <p className="text-sm text-muted-foreground">
          Manage your episode collection
        </p>
      </div>
      <div className="flex items-center space-x-2 mb-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search episode..."
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <CreateEpisodeDialog serieId={seriesId} />
      </div>
      <div className="container mx-auto">
        <DataTable columns={episodeColumns} data={data} />
        <div className="flex items-center justify-end space-x-2 py-4">
          <div className="flex w-[100px] items-center justify-center text-sm font-medium">
            Page {episodeData?.pageIndex} of {totalPage}
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
    </div>
  );
};
