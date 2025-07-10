import { useMutation } from "@tanstack/react-query";
import { movieApi } from "@/lib/api-client";
import { CreateMoviePayload, UpdateMoviePayload } from "@/models";
import { QueryKeys } from "@/constants";

export const useCreateMovie = () =>
  useMutation({
    mutationKey: [QueryKeys.MOVIES, "create"],
    mutationFn: (payload: CreateMoviePayload) => movieApi.create(payload),
  });

export const useUpdateMovie = () =>
  useMutation({
    mutationKey: [QueryKeys.MOVIES, "update"],
    mutationFn: ({ movieId, payload }: { movieId: string; payload: UpdateMoviePayload }) =>
      movieApi.update(movieId, payload),
  });

export const useDeleteMovie = () =>
  useMutation({
    mutationKey: [QueryKeys.MOVIES, "delete"],
    mutationFn: (movieId: string) => movieApi.delete(movieId),
  });