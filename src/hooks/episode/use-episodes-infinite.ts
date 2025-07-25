import { useInfiniteQuery } from "@tanstack/react-query";
import { episodeApi } from "@/lib/api-client";
import { EpisodeFilter } from "@/models/episode";
import { QueryKeys } from "@/constants";

type EpisodeInfiniteQueryOptions = Omit<unknown, "queryKey" | "queryFn">;

export const useEpisodesInfinite = (
  request: Omit<EpisodeFilter, "pageIndex">,
  options: EpisodeInfiniteQueryOptions = {}
) =>
  useInfiniteQuery({
    ...options,
    queryKey: [QueryKeys.EPISODES, "infinite", request],
    queryFn: ({ pageParam = 1 }) =>
      episodeApi.getAll({ ...request, pageIndex: pageParam }),
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.data.length === 0) return undefined;
      if (lastPage.data.length < (request.pageSize || 10)) return undefined;

      return allPages.length + 1;
    },
    initialPageParam: 1,
  });
