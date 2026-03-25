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
  update: (movieId: string | number, payload: UpdateMoviePayload) =>
    axiosClient.put(`/movies/${movieId}`, serialize(payload)),
  delete: (movieId: string | number) => axiosClient.delete(`/movies/${movieId}`),

  get: async (movieId: string | number) => {
    const response = await axiosClient.get<MovieDetail>(`/movies/${movieId}`);
    const body = response.data as
      | MovieDetail
      | { success?: boolean; data?: MovieDetail };

    if (
      body &&
      typeof body === "object" &&
      "success" in body &&
      "data" in body
    ) {
      return (body as { data: MovieDetail }).data;
    }

    return body as MovieDetail;
  },
  getAll: async (request: MovieFilter) => {
    const params = {
      ...request,
      actors: request.actors?.join(","),
      genres: request.genres?.join(","),
      keywords: request.keywords?.join(","),
    };

    const response = await axiosClient.get(`/movies`, {
      params,
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
      items: Movie[];
      Items: Movie[];
      data: Movie[] | { items?: Movie[]; Items?: Movie[] };
    }>;

    const rawData = paged.data;
    const normalizedData = Array.isArray(rawData)
      ? rawData
      : Array.isArray(rawData?.items)
        ? rawData.items
        : Array.isArray(rawData?.Items)
          ? rawData.Items
          : Array.isArray(paged.items)
            ? paged.items
            : Array.isArray(paged.Items)
              ? paged.Items
              : [];

    const normalized: PaginatedResult<Movie> = {
      pageIndex: paged.pageIndex ?? request.pageIndex ?? 1,
      pageSize: paged.pageSize ?? request.pageSize ?? 10,
      total: paged.total ?? paged.totalCount ?? normalizedData.length,
      data: normalizedData,
    };

    return normalized;
  },
};
