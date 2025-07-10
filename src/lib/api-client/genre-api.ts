import { CreateGenrePayload, Genre, GenreQueryable } from "@/models";
import axiosClient from "./axios-client";
import { serialize } from "object-to-formdata";
import { PaginatedResult } from "@/models/pagination";

export const genreApi = {
  create: (payload: CreateGenrePayload) =>
    axiosClient.post("/genres", serialize(payload)),
  update: (genreId: string, payload: CreateGenrePayload) =>
    axiosClient.put(`/genres/${genreId}`, serialize(payload)),
  delete: (genreId: string) => axiosClient.delete(`/genres/${genreId}`),
  getAll: async (request: GenreQueryable) => {
    const response = await axiosClient.get<PaginatedResult<Genre>>(`/genres`, {
      params: request,
    });
    return response.data;
  },
};
