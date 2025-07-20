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
  update: (episodeId: number, payload: UpdateEpisodePayload) =>
    axiosClient.put(`/episodes/${episodeId}`, serialize(payload)),
  delete: (episodeId: number) => axiosClient.delete(`/episodes/${episodeId}`),

  get: async (episodeId: number) => {
    const response = await axiosClient.get<EpisodeDetail>(
      `/episodes/${episodeId}`
    );
    return response.data;
  },
  getAll: async (request: EpisodeFilter) => {
    const response = await axiosClient.get<PaginatedResult<Episode>>(
      `/episodes`,
      {
        params: request,
      }
    );
    return response.data;
  },
};
