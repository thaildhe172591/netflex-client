import { useInfiniteQuery } from "@tanstack/react-query";
import { genreApi } from "@/lib/api-client";
import { GenreFilter } from "@/models";
import { QueryKeys } from "@/constants";

type GenreInfiniteQueryOptions = Omit<unknown, "queryKey" | "queryFn">;

export const useGenresInfinite = (
  request: Omit<GenreFilter, "pageIndex">,
  options: GenreInfiniteQueryOptions = {}
) =>
  useInfiniteQuery({
    ...options,
    queryKey: [QueryKeys.GENRES, "infinite", request],
    queryFn: ({ pageParam = 1 }) =>
      genreApi.getAll({ ...request, pageIndex: pageParam }),
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.data.length === 0) return undefined;
      if (lastPage.data.length < (request.pageSize || 10)) return undefined;

      return allPages.length + 1;
    },
    initialPageParam: 1,
  });
