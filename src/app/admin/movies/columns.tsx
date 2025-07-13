"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ColumnDef } from "@tanstack/react-table";
import { Edit, Eye, MoreHorizontal, Trash2 } from "lucide-react";
import { useState } from "react";
import { UpdateMovieSheet } from "./_components/update-movie-sheet";
import { DeleteMovieDialog } from "./_components/delete-movie-dialog";

export type MovieItem = {
  id: number;
  title: string;
  year: number;
  status: "Published" | "Coming soon";
  duration: string;
};

export const columns: ColumnDef<MovieItem>[] = [
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "year",
    header: "Year",
  },
  {
    accessorKey: "duration",
    header: "Duration",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const item = row.original;
      return (
        <Badge variant={item.status === "Published" ? "default" : "secondary"}>
          {item.status}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    cell: MovieActionsCell,
  },
];

interface MovieActionsCellProps {
  row: {
    original: MovieItem;
  };
}

function MovieActionsCell({ row }: MovieActionsCellProps) {
  const movie = row.original;
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
      <UpdateMovieSheet
        movieId={movie.id.toString()}
        isOpen={isUpdateSheetOpen}
        setIsOpen={setIsUpdateSheetOpen}
      />
      <DeleteMovieDialog
        movie={movie}
        isOpen={isDeleteDialogOpen}
        setIsOpen={setIsDeleteDialogOpen}
      />
    </>
  );
}
