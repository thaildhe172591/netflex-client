"use client";

import { Button } from "@/components/ui/button";
import { ResponsiveDialog } from "@/components/responsive-dialog";
import { useQueryClient } from "@tanstack/react-query";
import { QueryKeys } from "@/constants";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { AlertCircleIcon } from "lucide-react";
import { Episode } from "@/models/episode";
import { Dispatch, SetStateAction } from "react";
import { Icons } from "@/components/common/icon";
import { useDeleteEpisode } from "../_hooks/use-episode-mutations";

interface DeleteEpisodeDialogProps {
  episode: Episode;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

export function DeleteEpisodeDialog({
  episode,
  isOpen,
  setIsOpen,
}: DeleteEpisodeDialogProps) {
  const queryClient = useQueryClient();
  const { mutate: deleteEpisode, isPending, error } = useDeleteEpisode();

  const onSubmit = async () => {
    deleteEpisode(episode.id, {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [QueryKeys.SERIES, episode.seriesId],
        });
        setIsOpen(false);
      },
      onError: (error) => {
        console.error("Failed to delete episode:", error);
      },
    });
  };

  return (
    <ResponsiveDialog
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      title="Delete Episode"
      description={`Are you sure you want to delete "${episode.name}"? This action cannot be undone.`}
      className="sm:max-w-sm"
    >
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircleIcon className="h-4 w-4" />
          <AlertTitle>
            {error instanceof Error ? error.message : "Delete failed."}
          </AlertTitle>
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
