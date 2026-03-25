import { Genre, CreateGenrePayload, GenreFilter } from "@/models";
import axiosClient from "./axios-client";
import { PaginatedResult } from "@/models/pagination";

export const genreApi = {
  create: (payload: CreateGenrePayload) => axiosClient.post("/genres", payload),
  delete: (genreId: number) => axiosClient.delete(`/genres/${genreId}`),
  getAll: async (request: GenreFilter) => {
    const response = await axiosClient.get(`/genres`, {
      params: request,
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
      items: Genre[];
      data: Genre[];
      Items: Genre[];
    }>;

    const normalizedData = Array.isArray(paged.data)
      ? paged.data
      : Array.isArray(paged.items)
        ? paged.items
        : Array.isArray(paged.Items)
          ? paged.Items
          : [];

    const normalized: PaginatedResult<Genre> = {
      pageIndex: paged.pageIndex ?? request.pageIndex ?? 1,
      pageSize: paged.pageSize ?? request.pageSize ?? 10,
      total: paged.total ?? paged.totalCount ?? normalizedData.length,
      data: normalizedData,
    };

    return normalized;
  },
};
