import { PaginatedResult } from "@/models/pagination";
import axiosClient from "./axios-client";
import { ReportFilter, ReportDto, UpdateReportPayload } from "@/models";

type ApiEnvelope<T> = {
  success: boolean;
  data: T;
  error: unknown;
};

const unwrap = <T>(payload: T | ApiEnvelope<T>): T => {
  if (
    payload &&
    typeof payload === "object" &&
    "success" in payload &&
    "data" in payload
  ) {
    return (payload as ApiEnvelope<T>).data;
  }
  return payload as T;
};

export const reportApi = {
  getAll: async (params?: ReportFilter) => {
    const response = await axiosClient.get<
      PaginatedResult<ReportDto> | ApiEnvelope<PaginatedResult<ReportDto>>
    >("/reports", { params });
    return unwrap(response.data);
  },

  update: async (id: string, payload: UpdateReportPayload) => {
    const response = await axiosClient.put<
      ReportDto | ApiEnvelope<ReportDto>
    >(`/reports/${id}`, payload);
    return unwrap(response.data);
  },

  delete: (id: string) => axiosClient.delete(`/reports/${id}`),
};
