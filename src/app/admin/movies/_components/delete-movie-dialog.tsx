"use client";

import { Button } from "@/components/ui/button";
import { ResponsiveDialog } from "@/components/responsive-dialog";
import { useDeleteMovie } from "../_hooks/use-movie-mutations";
import { useQueryClient } from "@tanstack/react-query";
import { QueryKeys } from "@/constants";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { AlertCircleIcon } from "lucide-react";
import { Movie } from "@/models";

import { Dispatch, SetStateAction } from "react";
import { Icons } from "@/components/common/icon";

interface DeleteMovieDialogProps {
  movie: Movie;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

export function DeleteMovieDialog({
  movie,
  isOpen,
  setIsOpen,
}: DeleteMovieDialogProps) {
  const queryClient = useQueryClient();
  const { mutate: deleteMovie, isPending, error } = useDeleteMovie();

  const onSubmit = async () => {
    deleteMovie(movie.id, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [QueryKeys.MOVIES] });
        setIsOpen(false);
      },
      onError: (error) => {
        console.error("Failed to delete movie:", error);
      },
    });
  };

  return (
    <ResponsiveDialog
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      title="Delete Movie"
      description={`Are you sure you want to delete "${movie.title}"? This action cannot be undone.`}
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
