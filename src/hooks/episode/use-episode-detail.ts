import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { episodeApi } from "@/lib/api-client";
import { EpisodeDetail } from "@/models/episode";
import { QueryKeys } from "@/constants";

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
