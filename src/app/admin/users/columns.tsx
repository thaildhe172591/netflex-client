"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { ActionCell } from "./action-cell";

export type UserItem = {
  id: string;
  email: string;
  roles: string;
  status: string;
};

export const columns: ColumnDef<UserItem>[] = [
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => {
      return <Badge variant="secondary">{row.original.roles}</Badge>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      return (
        <Badge
          variant={row.original.status === "active" ? "default" : "destructive"}
        >
          {row.original.status}
        </Badge>
      );
    },
  },

  {
    id: "actions",
    cell: ({ row }) => {
      const user = row.original;
      return <ActionCell user={user} />;
    },
  },
];
