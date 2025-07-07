import {
  Serie,
  SerieDetail,
  CreateSeriePayload,
  UpdateSeriePayload,
  SerieQueryable,
} from "@/models";

import axiosClient from "./axios-client";
import { serialize } from "object-to-formdata";
import { PaginatedResult } from "@/models/pagination";

export const serieApi = {
  create: (payload: CreateSeriePayload) =>
    axiosClient.post("/series", serialize(payload)),

  update: (serieId: string | number, payload: UpdateSeriePayload) =>
    axiosClient.put(`/series/${serieId}`, serialize(payload)),

  delete: (serieId: string | number) =>
    axiosClient.delete(`/series/${serieId}`),

  get: async (serieId: string | number) => {
    const response = await axiosClient.get<SerieDetail>(`/series/${serieId}`);
    return response.data;
  },

  getAll: async (request: SerieQueryable) => {
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
