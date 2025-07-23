"use client";

import { Button } from "@/components/ui/button";
import { ResponsiveDialog } from "@/components/responsive-dialog";
import { useDeleteGenre } from "../_hooks/use-genre-mutations";
import { useQueryClient } from "@tanstack/react-query";
import { QueryKeys } from "@/constants";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { AlertCircleIcon } from "lucide-react";
import { GenreItem } from "../columns";

import { Dispatch, SetStateAction } from "react";
import { Icons } from "@/components/common";

interface DeleteGenreDialogProps {
  genre: GenreItem;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

export function DeleteGenreDialog({
  genre,
  isOpen,
  setIsOpen,
}: DeleteGenreDialogProps) {
  const queryClient = useQueryClient();
  const { mutate: deleteGenre, isPending, error } = useDeleteGenre();

  const onSubmit = async () => {
    deleteGenre(genre.id, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [QueryKeys.GENRES] });
        setIsOpen(false);
      },
      onError: (error) => {
        console.error("Failed to delete genre:", error);
      },
    });
  };

  return (
    <ResponsiveDialog
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      title="Delete Genre"
      description={`Are you sure you want to delete "${genre.name}"? This action cannot be undone.`}
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
