import { useQuery } from "@tanstack/react-query";
import { serieApi } from "@/lib/api-client/serie-api";
import { SerieFilter } from "@/models";
import { QueryKeys } from "@/constants";

type SerieQueryOptions = Omit<unknown, "queryKey" | "queryFn">;

export const useSeries = (
  request: SerieFilter,
  options: SerieQueryOptions = {}
) =>
  useQuery({
    ...options,
    queryKey: [QueryKeys.SERIES, request],
    queryFn: () => serieApi.getAll(request),
  });
