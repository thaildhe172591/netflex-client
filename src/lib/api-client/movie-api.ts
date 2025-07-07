import {
  CreateMoviePayload,
  Movie,
  MovieDetail,
  MovieQueryable,
  UpdateMoviePayload,
} from "@/models";
import axiosClient from "./axios-client";
import { serialize } from "object-to-formdata";
import { PaginatedResult } from "@/models/pagination";

export const movieApi = {
  create: (payload: CreateMoviePayload) =>
    axiosClient.post("/movies", serialize(payload)),
  update: (movieId: string, payload: UpdateMoviePayload) =>
    axiosClient.put(`/movies/${movieId}`, serialize(payload)),
  delete: (movieId: string) => axiosClient.delete(`/movies/${movieId}`),

  get: async (movieId: string) => {
    const response = await axiosClient.get<MovieDetail>(`/movies/${movieId}`);
    return response.data;
  },
  getAll: async (request: MovieQueryable) => {
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
