import { useQuery } from "@tanstack/react-query";
import { movieApi } from "@/lib/api-client";
import { MovieQueryable } from "@/models";
import { QueryKeys } from "@/constants";

type MovieQueryOptions = Omit<unknown, "queryKey" | "queryFn">;

export const useMovie = (
  request: MovieQueryable,
  options: MovieQueryOptions = {}
) =>
  useQuery({
    ...options,
    queryKey: [QueryKeys.MOVIES],
    queryFn: () => movieApi.getAll(request),
  });
