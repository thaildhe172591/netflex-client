import {
  useQuery,
  useMutation,
  useQueryClient,
  UseQueryOptions,
} from "@tanstack/react-query";
import { episodeApi } from "@/lib/api-client";
import {
  Episode,
  CreateEpisodePayload,
  UpdateEpisodePayload,
  EpisodeFilter,
  EpisodeDetail,
} from "@/models/episode";
import { PaginatedResult } from "@/models/pagination";
import { QueryKeys } from "@/constants";

export type ListQueryOptions = Omit<
  UseQueryOptions<PaginatedResult<Episode>>,
  "queryKey" | "queryFn"
>;

export function useEpisodes(
  filter: EpisodeFilter,
  options: ListQueryOptions = {}
) {
  return useQuery({
    ...options,
    queryKey: [QueryKeys.EPISODES, filter],
    queryFn: () => episodeApi.getAll(filter),
  });
}

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
      episodeId: number;
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
    mutationFn: (episodeId: number) => episodeApi.delete(episodeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.EPISODES] });
    },
  });
}

export function useEpisodeDetail(
  episodeId: number,
  options: Omit<UseQueryOptions<EpisodeDetail>, "queryKey" | "queryFn"> = {}
) {
  return useQuery({
    ...options,
    queryKey: [QueryKeys.EPISODES, episodeId],
    queryFn: () => episodeApi.get(episodeId),
    enabled: !!episodeId,
  });
}
