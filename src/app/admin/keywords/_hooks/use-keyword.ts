import { useQuery } from "@tanstack/react-query";
import { keywordApi } from "@/lib/api-client/keyword-api";
import { QueryKeys } from "@/constants";
import { KeywordFilter } from "@/models/keyword";

type KeywordQueryOptions = Omit<unknown, "queryKey" | "queryFn">;

export const useKeywords = (
  request: KeywordFilter,
  options: KeywordQueryOptions = {}
) =>
  useQuery({
    ...options,
    queryKey: [
      QueryKeys.KEYWORDS,
      request.pageIndex,
      request.pageSize,
      request.search,
      request.sortBy,
    ],
    queryFn: () => keywordApi.getAll(request),
  });
