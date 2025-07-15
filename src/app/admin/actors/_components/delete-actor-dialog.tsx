"use client";

import { Button } from "@/components/ui/button";
import { ResponsiveDialog } from "@/components/responsive-dialog";
import { useDeleteActor } from "../_hooks/use-actor-mutations";
import { useQueryClient } from "@tanstack/react-query";
import { QueryKeys } from "@/constants";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { AlertCircleIcon } from "lucide-react";
import { ActorItem } from "../columns"; // Using ActorItem from columns.tsx for now

import { Dispatch, SetStateAction } from "react";

interface DeleteActorDialogProps {
  actor: ActorItem;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

export function DeleteActorDialog({
  actor,
  isOpen,
  setIsOpen,
}: DeleteActorDialogProps) {
  const queryClient = useQueryClient();
  const { mutate: deleteActor, isPending, error } = useDeleteActor();

  const onSubmit = async () => {
    deleteActor(actor.id.toString(), {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [QueryKeys.ACTORS] });
        setIsOpen(false);
      },
      onError: (error) => {
        console.error("Failed to delete actor:", error);
      },
    });
  };

  return (
    <ResponsiveDialog
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      title="Delete Actor"
      description={`Are you sure you want to delete "${actor.name}"? This action cannot be undone.`}
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