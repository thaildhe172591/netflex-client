import {
  Serie,
  SerieDetail,
  CreateSeriePayload,
  UpdateSeriePayload,
  SerieFilter,
} from "@/models";

import axiosClient from "./axios-client";
import { PaginatedResult } from "@/models/pagination";
import { serialize } from "../serialize-form-data";

export const serieApi = {
  create: (payload: CreateSeriePayload) =>
    axiosClient.post("/series", serialize(payload)),

  update: (serieId: string | number, payload: UpdateSeriePayload) =>
    axiosClient.put(`/series/${serieId}`, serialize(payload)),

  delete: (serieId: string | number) => axiosClient.delete(`/series/${serieId}`),

  get: async (serieId: string | number) => {
    const response = await axiosClient.get<SerieDetail>(`/series/${serieId}`);
    const body = response.data as
      | SerieDetail
      | { success?: boolean; data?: SerieDetail };

    if (
      body &&
      typeof body === "object" &&
      "success" in body &&
      "data" in body
    ) {
      return (body as { data: SerieDetail }).data;
    }

    return body as SerieDetail;
  },

  getAll: async (request: SerieFilter) => {
    const params = {
      ...request,
      genres: request.genres?.join(","),
      keywords: request.keywords?.join(","),
    };
    const response = await axiosClient.get(`/series`, {
      params,
    });
    const body = response.data as
      | {
          success?: boolean;
          data?: unknown;
        }
      | unknown;

    const payload =
      body && typeof body === "object" && "success" in body && "data" in body
        ? (body as { data: unknown }).data
        : body;

    const paged = (payload ?? {}) as Partial<{
      pageIndex: number;
      pageSize: number;
      total: number;
      totalCount: number;
      items: Serie[];
      Items: Serie[];
      data: Serie[] | { items?: Serie[]; Items?: Serie[] };
    }>;

    const rawData = paged.data;
    const normalizedData = Array.isArray(rawData)
      ? rawData
      : Array.isArray(rawData?.items)
        ? rawData.items
        : Array.isArray(rawData?.Items)
          ? rawData.Items
          : Array.isArray(paged.items)
            ? paged.items
            : Array.isArray(paged.Items)
              ? paged.Items
              : [];

    const normalized: PaginatedResult<Serie> = {
      pageIndex: paged.pageIndex ?? request.pageIndex ?? 1,
      pageSize: paged.pageSize ?? request.pageSize ?? 10,
      total: paged.total ?? paged.totalCount ?? normalizedData.length,
      data: normalizedData,
    };

    return normalized;
  },
};
