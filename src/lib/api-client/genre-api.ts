import { Genre, CreateGenrePayload, GenreFilter } from "@/models";
import axiosClient from "./axios-client";
import { PaginatedResult } from "@/models/pagination";

export const genreApi = {
  create: (payload: CreateGenrePayload) => axiosClient.post("/genres", payload),
  delete: (genreId: number) => axiosClient.delete(`/genres/${genreId}`),
  getAll: async (request: GenreFilter) => {
    const response = await axiosClient.get<PaginatedResult<Genre>>(`/genres`, {
      params: request,
    });
    return response.data;
  },
};
