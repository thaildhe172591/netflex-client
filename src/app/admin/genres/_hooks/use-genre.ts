import { useQuery } from "@tanstack/react-query";
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
