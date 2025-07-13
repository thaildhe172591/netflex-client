import { CreateGenrePayload, Genre, GenreFilter } from "@/models";
import axiosClient from "./axios-client";
import { PaginatedResult } from "@/models/pagination";

export const genreApi = {
  create: (payload: CreateGenrePayload) => axiosClient.post("/genres", payload),
  update: (genreId: string, payload: CreateGenrePayload) =>
    axiosClient.put(`/genres/${genreId}`, payload),
  delete: (genreId: string) => axiosClient.delete(`/genres/${genreId}`),
  getAll: async (request: GenreFilter) => {
    const response = await axiosClient.get<PaginatedResult<Genre>>(`/genres`, {
      params: request,
    });
    return response.data;
  },
};
