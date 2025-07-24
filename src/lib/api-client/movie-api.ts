import {
  CreateMoviePayload,
  Movie,
  MovieDetail,
  MovieFilter,
  UpdateMoviePayload,
} from "@/models";
import axiosClient from "./axios-client";
import { PaginatedResult } from "@/models/pagination";
import { serialize } from "../serialize-form-data";

export const movieApi = {
  create: (payload: CreateMoviePayload) =>
    axiosClient.post("/movies", serialize(payload)),
  update: (movieId: number, payload: UpdateMoviePayload) =>
    axiosClient.put(`/movies/${movieId}`, serialize(payload)),
  delete: (movieId: number) => axiosClient.delete(`/movies/${movieId}`),

  get: async (movieId: number) => {
    const response = await axiosClient.get<MovieDetail>(`/movies/${movieId}`);
    return response.data;
  },
  getAll: async (request: MovieFilter) => {
    const params = {
      ...request,
      actors: request.actors?.join(","),
      genres: request.genres?.join(","),
      keywords: request.keywords?.join(","),
    };

    const response = await axiosClient.get<PaginatedResult<Movie>>(`/movies`, {
      params,
    });
    return response.data;
  },
};
