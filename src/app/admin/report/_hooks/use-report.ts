import { useQuery } from "@tanstack/react-query";
import { reportApi } from "@/lib/api-client";
import { ReportFilter } from "@/models";
import { QueryKeys } from "@/constants";

type ReportQueryOptions = Omit<unknown, "queryKey" | "queryFn">;

export const useReports = (
  filter: ReportFilter,
  options: ReportQueryOptions = {}
) =>
  useQuery({
    ...options,
    queryKey: [QueryKeys.REPORTS, filter],
    queryFn: () => reportApi.getAll(filter),
  });
