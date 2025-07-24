"use client";

import { Button } from "@/components/ui/button";
import { ResponsiveDialog } from "@/components/responsive-dialog";
import { useDeleteSerie } from "../_hooks/use-serie-mutations";
import { useQueryClient } from "@tanstack/react-query";
import { QueryKeys } from "@/constants";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { AlertCircleIcon } from "lucide-react";
import { Dispatch, SetStateAction } from "react";
import { Icons } from "@/components/common/icon";

interface DeleteSerieDialogProps {
  serieId: number;
  serieName?: string;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

export function DeleteSerieDialog({
  serieId,
  serieName,
  isOpen,
  setIsOpen,
}: DeleteSerieDialogProps) {
  const queryClient = useQueryClient();
  const { mutate: deleteSerie, isPending, error } = useDeleteSerie();

  const onSubmit = async () => {
    deleteSerie(serieId, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [QueryKeys.SERIES] });
        setIsOpen(false);
      },
      onError: (error) => {
        console.error("Failed to delete serie:", error);
      },
    });
  };

  return (
    <ResponsiveDialog
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      title="Delete Serie"
      description={`Are you sure you want to delete${
        serieName ? ` "${serieName}"` : " this serie"
      }? This action cannot be undone.`}
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
          {isPending && <Icons.spinner className="animate-spin" />}
          Delete
        </Button>
      </div>
    </ResponsiveDialog>
  );
}
