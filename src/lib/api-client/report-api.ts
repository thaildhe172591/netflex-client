import { PaginatedResult } from "@/models/pagination";
import axiosClient from "./axios-client";
import { ReportFilter, ReportDto, UpdateReportPayload } from "@/models";

export const reportApi = {
  getAll: (params?: ReportFilter) =>
    axiosClient.get<PaginatedResult<ReportDto>>("/reports", { params }),

  update: (id: number, payload: UpdateReportPayload) =>
    axiosClient.put(`/reports/${id}`, payload),

  delete: (id: number) => axiosClient.delete(`/reports/${id}`),
};
