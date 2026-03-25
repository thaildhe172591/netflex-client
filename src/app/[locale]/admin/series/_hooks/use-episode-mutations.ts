import { useMutation, useQueryClient } from "@tanstack/react-query";
import { episodeApi } from "@/lib/api-client";
import { CreateEpisodePayload, UpdateEpisodePayload } from "@/models/episode";
import { QueryKeys } from "@/constants";

export function useCreateEpisode() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateEpisodePayload) => episodeApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.EPISODES] });
    },
  });
}

export function useUpdateEpisode() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      episodeId,
      payload,
    }: {
      episodeId: string;
      payload: UpdateEpisodePayload;
    }) => episodeApi.update(episodeId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.EPISODES] });
    },
  });
}

export function useDeleteEpisode() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (episodeId: string) => episodeApi.delete(episodeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.EPISODES] });
    },
  });
}
