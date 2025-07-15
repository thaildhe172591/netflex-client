import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { genreApi } from "@/lib/api-client/genre-api";
import { QueryKeys } from "@/constants";
import { GenreFilter } from "@/models/genre";

type GenreQueryOptions = Omit<unknown, "queryKey" | "queryFn">;

export const useGenres = (
  request: GenreFilter,
  options: GenreQueryOptions = {}
) =>
  useQuery({
    ...options,
    queryKey: [QueryKeys.GENRES, request],
    queryFn: () => genreApi.getAll(request),
  });

type InfiniteGenreQueryOptions = Omit<
  unknown,
  "queryKey" | "queryFn" | "getNextPageParam"
>;

export const useInfiniteGenres = (
  request: GenreFilter,
  options: InfiniteGenreQueryOptions = {}
) =>
  useInfiniteQuery({
    ...options,
    queryKey: [QueryKeys.GENRES, request],
    queryFn: ({ pageParam = 1 }) =>
      genreApi.getAll({ ...request, pageIndex: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.pageIndex * lastPage.pageSize >= lastPage.total) {
        return undefined;
      }
      return lastPage.pageIndex + 1;
    },
    select: (data) => data.pages.flatMap((page) => page.data),
  });
