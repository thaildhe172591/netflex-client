import { useQuery } from "@tanstack/react-query";
import { movieApi } from "@/lib/api-client";
import { MovieFilter } from "@/models";
import { QueryKeys } from "@/constants";

type MovieQueryOptions = Omit<unknown, "queryKey" | "queryFn">;

export const useMovies = (
  request: MovieFilter,
  options: MovieQueryOptions = {}
) =>
  useQuery({
    ...options,
    queryKey: [QueryKeys.MOVIES, request],
    queryFn: () => movieApi.getAll(request),
  });
