import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { DeleteReportDialog } from "./_components/delete-report-dialog";

export type ReportItem = {
  id: number;
  reason: string;
  description?: string;
  process: string;
  createdAt?: Date;
  createdBy?: string;
};

export const columns: ColumnDef<ReportItem>[] = [
  {
    accessorKey: "reason",
    header: "Reason",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "process",
    header: "Process Status",
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => {
      return row.original.createdAt
        ? new Date(row.original.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          })
        : "N/A";
    },
  },
  {
    accessorKey: "createdBy",
    header: "Created By",
  },
  {
    id: "actions",
    cell: ReportActionsCell,
  },
];

interface ReportActionsCellProps {
  row: {
    original: ReportItem;
  };
}

function ReportActionsCell({ row }: ReportActionsCellProps) {
  const report = row.original;
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
            className="text-red-600"
            onClick={() => setIsDeleteDialogOpen(true)}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DeleteReportDialog
        report={report}
        isOpen={isDeleteDialogOpen}
        setIsOpen={setIsDeleteDialogOpen}
      />
    </>
  );
}
