import { useQuery } from "@tanstack/react-query";
import { genreApi } from "@/lib/api-client/genre-api";
import { QueryKeys } from "@/constants";
import { GenreQueryable } from "@/models/genre";

type GenreQueryOptions = Omit<unknown, "queryKey" | "queryFn">;

export const useGenres = (
  request: GenreQueryable,
  options: GenreQueryOptions = {}
) =>
  useQuery({
    ...options,
    queryKey: [
      QueryKeys.GENRES,
      request.pageIndex,
      request.pageSize,
      request.search,
      request.sortBy,
    ],
    queryFn: () => genreApi.getAll(request),
  });
