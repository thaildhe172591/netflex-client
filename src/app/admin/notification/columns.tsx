"use client";

import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";

export type NotificationItem = {
  id: number;
  title: string;
  content: string;
  createdAt: string;
};

export const columns: ColumnDef<NotificationItem>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "content",
    header: "Content",
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => {
      return format(new Date(row.original.createdAt), "PPp");
    },
  },
];
