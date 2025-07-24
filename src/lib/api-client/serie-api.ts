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

  update: (serieId: number, payload: UpdateSeriePayload) =>
    axiosClient.put(`/series/${serieId}`, serialize(payload)),

  delete: (serieId: number) => axiosClient.delete(`/series/${serieId}`),

  get: async (serieId: string | number) => {
    const response = await axiosClient.get<SerieDetail>(`/series/${serieId}`);
    return response.data;
  },

  getAll: async (request: SerieFilter) => {
    const params = {
      ...request,
      genres: request.genres?.join(","),
      keywords: request.keywords?.join(","),
    };
    const response = await axiosClient.get<PaginatedResult<Serie>>(`/series`, {
      params,
    });
    return response.data;
  },
};
