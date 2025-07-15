"use client";

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
import { UpdateActorSheet } from "./_components/update-actor-sheet";
import { DeleteActorDialog } from "./_components/delete-actor-dialog";
import Image from "next/image";

export type ActorItem = {
  id: number;
  name: string;
  gender: boolean;
  birthDate?: string;
  biography?: string;
  image?: string;
};

export const columns: ColumnDef<ActorItem>[] = [
  {
    accessorKey: "image",
    header: () => <div className="hidden lg:table-cell">Avatar</div>,
    cell: ({ row }) => {
      const item = row.original;
      return (
        <Image
          src={item.image || ""}
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
    id: "actions",
    cell: ActorActionsCell,
  },
];

interface ActorActionsCellProps {
  row: {
    original: ActorItem;
  };
}

function ActorActionsCell({ row }: ActorActionsCellProps) {
  const actor = row.original;
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
      <UpdateActorSheet
        actorId={actor.id.toString()}
        isOpen={isUpdateSheetOpen}
        setIsOpen={setIsUpdateSheetOpen}
      />
      <DeleteActorDialog
        actor={actor}
        isOpen={isDeleteDialogOpen}
        setIsOpen={setIsDeleteDialogOpen}
      />
    </>
  );
}
