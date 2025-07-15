"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { DeleteGenreDialog } from "./_components/delete-genre-dialog";

export type GenreItem = {
  id: number;
  name: string;
};

export const columns: ColumnDef<GenreItem>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    id: "actions",
    cell: GenreActionsCell,
  },
];

interface GenreActionsCellProps {
  row: {
    original: GenreItem;
  };
}

function GenreActionsCell({ row }: GenreActionsCellProps) {
  const genre = row.original;
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  return (
    <>
      <div
        onClick={() => setIsDeleteDialogOpen(true)}
        className="hover:text-red-500 text-red-800"
      >
        <Trash2 className="mr-2 h-4 w-4" />
      </div>
      <DeleteGenreDialog
        genre={genre}
        isOpen={isDeleteDialogOpen}
        setIsOpen={setIsDeleteDialogOpen}
      />
    </>
  );
}
