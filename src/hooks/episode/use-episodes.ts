import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { episodeApi } from "@/lib/api-client";
import { Episode, EpisodeFilter } from "@/models/episode";
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
