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
      const pageSize = request.pageSize || 10;
      const currentPage = lastPage?.pageIndex ?? allPages.length;
      const total = lastPage?.total ?? 0;
      const totalPages = Math.ceil(total / pageSize);

      if (!Array.isArray(lastPage?.data)) return undefined;
      if (lastPage.data.length === 0) return undefined;
      if (totalPages > 0 && currentPage >= totalPages) return undefined;
      if (lastPage.data.length < pageSize) return undefined;

      return currentPage + 1;
    },
    initialPageParam: 1,
  });
