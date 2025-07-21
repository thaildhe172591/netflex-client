"use client";

import { Button } from "@/components/ui/button";
import { ResponsiveDialog } from "@/components/responsive-dialog";
import { useDeleteReport } from "../_hooks/use-report-mutations";
import { useQueryClient } from "@tanstack/react-query";
import { QueryKeys } from "@/constants";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { AlertCircleIcon } from "lucide-react";
import { ReportItem } from "../columns";
import { Dispatch, SetStateAction } from "react";

interface DeleteReportDialogProps {
  report: ReportItem;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

export function DeleteReportDialog({
  report,
  isOpen,
  setIsOpen,
}: DeleteReportDialogProps) {
  const queryClient = useQueryClient();
  const { mutate: deleteReport, isPending, error } = useDeleteReport();

  const onSubmit = async () => {
    deleteReport(report.id, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [QueryKeys.REPORTS] });
        setIsOpen(false);
      },
      onError: (error) => {
        console.error("Failed to delete report:", error);
      },
    });
  };

  return (
    <ResponsiveDialog
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      title="Delete Report"
      description={`Are you sure you want to delete this report? This action cannot be undone.`}
      className="sm:max-w-sm"
    >
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircleIcon className="h-4 w-4" />
          <AlertTitle>{error.message}</AlertTitle>
        </Alert>
      )}
      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => setIsOpen(false)}
          disabled={isPending}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="destructive"
          onClick={onSubmit}
          disabled={isPending}
        >
          {isPending ? "Deleting..." : "Delete"}
        </Button>
      </div>
    </ResponsiveDialog>
  );
}
