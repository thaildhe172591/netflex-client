import { useMutation } from "@tanstack/react-query";
import { reportApi } from "@/lib/api-client";
import { UpdateReportPayload } from "@/models";
import { QueryKeys } from "@/constants";

export const useUpdateReport = () =>
  useMutation({
    mutationKey: [QueryKeys.REPORTS, "update"],
    mutationFn: ({
      reportId,
      payload,
    }: {
      reportId: number;
      payload: UpdateReportPayload;
    }) => reportApi.update(reportId, payload),
  });

export const useDeleteReport = () =>
  useMutation({
    mutationKey: [QueryKeys.REPORTS, "delete"],
    mutationFn: (reportId: number) => reportApi.delete(reportId),
  });
