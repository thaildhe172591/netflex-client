"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Edit, Eye, MoreHorizontal, Trash2 } from "lucide-react";
import { useState } from "react";
import { UpdateEpisodeSheet } from "./update-episode-sheet";
import { DeleteEpisodeDialog } from "./delete-episode-dialog";

export type EpisodeItem = {
  id: number;
  name: string;
  airDate: string;
  runtime: number | string;
  status: string;
  serieId: number;
};

export const episodeColumns: ColumnDef<EpisodeItem>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "airDate",
    header: "Air Date",
  },
  {
    accessorKey: "runtime",
    header: "Runtime",
    cell: ({ row }) => {
      const runtime = row.original.runtime;
      return typeof runtime === "number" ? `${runtime} minutes` : runtime;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      return (
        <Badge variant={status === "Aired" ? "default" : "secondary"}>
          {status}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    cell: EpisodeActionsCell,
  },
];

interface EpisodeActionsCellProps {
  row: {
    original: EpisodeItem;
  };
}

function EpisodeActionsCell({ row }: EpisodeActionsCellProps) {
  const episode = row.original;
  const [isUpdateSheetOpen, setIsUpdateSheetOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>
            <Eye className="mr-2 h-4 w-4" />
            View
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setIsUpdateSheetOpen(true)}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            className="text-red-600"
            onClick={() => setIsDeleteDialogOpen(true)}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <UpdateEpisodeSheet
        episodeId={episode.id}
        isOpen={isUpdateSheetOpen}
        setIsOpen={setIsUpdateSheetOpen}
      />
      <DeleteEpisodeDialog
        episode={{
          id: episode.id,
          name: episode.name,
          airDate: new Date(episode.airDate),
          runtime:
            typeof episode.runtime === "number" ? episode.runtime : undefined,
          seriesId: episode.serieId,
        }}
        isOpen={isDeleteDialogOpen}
        setIsOpen={setIsDeleteDialogOpen}
      />
    </>
  );
}
