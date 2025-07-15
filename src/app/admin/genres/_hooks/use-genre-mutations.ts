import { useMutation } from "@tanstack/react-query";
import { genreApi } from "@/lib/api-client";
import { CreateGenrePayload } from "@/models";
import { QueryKeys } from "@/constants";

export const useCreateGenre = () =>
  useMutation({
    mutationKey: [QueryKeys.GENRES, "create"],
    mutationFn: (payload: CreateGenrePayload) => genreApi.create(payload),
  });

export const useDeleteGenre = () =>
  useMutation({
    mutationKey: [QueryKeys.GENRES, "delete"],
    mutationFn: (genreId: number) => genreApi.delete(genreId),
  });
