import { useQuery } from "@tanstack/react-query";
import { movieApi } from "@/lib/api-client";
import { QueryKeys } from "@/constants";

type MovieDetailQueryOptions = Omit<unknown, "queryKey" | "queryFn">;

export const useMovieDetail = (
  movieId: string,
  options: MovieDetailQueryOptions = {}
) =>
  useQuery({
    queryKey: [QueryKeys.MOVIES, movieId],
    queryFn: () => movieApi.get(movieId),
    enabled: !!movieId,
    ...options,
  });
