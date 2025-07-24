"use client";

import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Edit, MoreHorizontal, Trash2 } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { DeleteSerieDialog } from "./_components/delete-serie-dialog";

export type SerieItem = {
  id: number;
  name: string;
  country: string;
  year: number;
  posterUrl: string;
  status: "Completed" | "Ongoing";
};

export const columns: ColumnDef<SerieItem>[] = [
  {
    accessorKey: "posterUrl",
    header: () => <div className="hidden lg:table-cell">Poster</div>,
    cell: ({ row }) => {
      const item = row.original;
      return (
        <Image
          src={item.posterUrl}
          alt={item.name}
          width={75}
          height={100}
          className="rounded object-cover h-[100px] w-[75px] hidden lg:table-cell"
        />
      );
    },
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "year",
    header: "Year",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const item = row.original;
      return (
        <Badge variant={item.status === "Completed" ? "default" : "secondary"}>
          {item.status}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    cell: SerieActionsCell,
  },
];

interface SerieActionsCellProps {
  row: {
    original: SerieItem;
  };
}

function SerieActionsCell({ row }: SerieActionsCellProps) {
  const serie = row.original;
  const router = useRouter();
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
          <DropdownMenuItem
            onClick={() => router.push(`/admin/series/${serie.id}`)}
          >
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

      <DeleteSerieDialog
        serieId={serie.id}
        serieName={serie.name}
        isOpen={isDeleteDialogOpen}
        setIsOpen={setIsDeleteDialogOpen}
      />
    </>
  );
}
