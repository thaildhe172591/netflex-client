import { useMutation } from "@tanstack/react-query";
import { actorApi } from "@/lib/api-client/actor-api";
import { CreateActorPayload, UpdateActorPayload } from "@/models/actor";
import { QueryKeys } from "@/constants";

export const useCreateActor = () =>
  useMutation({
    mutationKey: [QueryKeys.ACTORS, "create"],
    mutationFn: (payload: CreateActorPayload) => actorApi.create(payload),
  });

export const useUpdateActor = () =>
  useMutation({
    mutationKey: [QueryKeys.ACTORS, "update"],
    mutationFn: ({
      actorId,
      payload,
    }: {
      actorId: string;
      payload: UpdateActorPayload;
    }) => actorApi.update(actorId, payload),
  });

export const useDeleteActor = () =>
  useMutation({
    mutationKey: [QueryKeys.ACTORS, "delete"],
    mutationFn: (actorId: string) => actorApi.delete(actorId),
  });
