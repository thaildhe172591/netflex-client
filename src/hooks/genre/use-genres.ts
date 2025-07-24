import { useQuery } from "@tanstack/react-query";
import { genreApi } from "@/lib/api-client";
import { GenreFilter } from "@/models";
import { QueryKeys } from "@/constants";

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
