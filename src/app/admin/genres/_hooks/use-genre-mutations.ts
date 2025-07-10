import { useMutation } from "@tanstack/react-query";
import { genreApi } from "@/lib/api-client/genre-api";
import { CreateGenrePayload } from "@/models/genre";
import { QueryKeys } from "@/constants";

export const useCreateGenre = () =>
  useMutation({
    mutationKey: [QueryKeys.GENRES, "create"],
    mutationFn: (payload: CreateGenrePayload) => genreApi.create(payload),
  });

export const useUpdateGenre = () =>
  useMutation({
    mutationKey: [QueryKeys.GENRES, "update"],
    mutationFn: ({ genreId, payload }: { genreId: string; payload: CreateGenrePayload }) =>
      genreApi.update(genreId, payload),
  });

export const useDeleteGenre = () =>
  useMutation({
    mutationKey: [QueryKeys.GENRES, "delete"],
    mutationFn: (genreId: string) => genreApi.delete(genreId),
  });