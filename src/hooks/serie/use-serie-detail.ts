import { useQuery } from "@tanstack/react-query";
import { serieApi } from "@/lib/api-client/serie-api";
import { QueryKeys } from "@/constants";

type SerieDetailQueryOptions = Omit<unknown, "queryKey" | "queryFn">;

export const useSerieDetail = (
  serieId: number,
  options: SerieDetailQueryOptions = {}
) =>
  useQuery({
    queryKey: [QueryKeys.SERIES, serieId],
    queryFn: () => serieApi.get(serieId),
    enabled: !!serieId,
    ...options,
  });
