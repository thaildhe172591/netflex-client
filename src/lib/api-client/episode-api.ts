import {
  Episode,
  EpisodeDetail,
  CreateEpisodePayload,
  UpdateEpisodePayload,
  EpisodeFilter,
} from "@/models/episode";
import axiosClient from "./axios-client";
import { PaginatedResult } from "@/models/pagination";
import { serialize } from "../serialize-form-data";

export const episodeApi = {
  create: (payload: CreateEpisodePayload) =>
    axiosClient.post("/episodes", serialize(payload)),
  update: (episodeId: string | number, payload: UpdateEpisodePayload) =>
    axiosClient.put(`/episodes/${episodeId}`, serialize(payload)),
  delete: (episodeId: string | number) => axiosClient.delete(`/episodes/${episodeId}`),

  get: async (episodeId: string | number) => {
    const response = await axiosClient.get<EpisodeDetail>(
      `/episodes/${episodeId}`
    );
    const body = response.data as
      | EpisodeDetail
      | { success?: boolean; data?: EpisodeDetail };

    if (
      body &&
      typeof body === "object" &&
      "success" in body &&
      "data" in body
    ) {
      return (body as { data: EpisodeDetail }).data;
    }

    return body as EpisodeDetail;
  },
  getAll: async (request: EpisodeFilter) => {
    const response = await axiosClient.get(`/episodes`, {
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
      items: Episode[];
      Items: Episode[];
      data: Episode[];
    }>;

    const normalizedData = Array.isArray(paged.data)
      ? paged.data
      : Array.isArray(paged.items)
        ? paged.items
        : Array.isArray(paged.Items)
          ? paged.Items
          : [];

    const normalized: PaginatedResult<Episode> = {
      pageIndex: paged.pageIndex ?? request.pageIndex ?? 1,
      pageSize: paged.pageSize ?? request.pageSize ?? 10,
      total: paged.total ?? paged.totalCount ?? normalizedData.length,
      data: normalizedData,
    };

    return normalized;
  },
};
