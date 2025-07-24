import { useMutation } from "@tanstack/react-query";
import { serieApi } from "@/lib/api-client/serie-api";
import { CreateSeriePayload, UpdateSeriePayload } from "@/models";
import { QueryKeys } from "@/constants";

export const useCreateSerie = () =>
  useMutation({
    mutationKey: [QueryKeys.SERIES, "create"],
    mutationFn: (payload: CreateSeriePayload) => serieApi.create(payload),
  });

export const useUpdateSerie = () =>
  useMutation({
    mutationKey: [QueryKeys.SERIES, "update"],
    mutationFn: ({
      serieId,
      payload,
    }: {
      serieId: number;
      payload: UpdateSeriePayload;
    }) => serieApi.update(serieId, payload),
  });

export const useDeleteSerie = () =>
  useMutation({
    mutationKey: [QueryKeys.SERIES, "delete"],
    mutationFn: (serieId: number) => serieApi.delete(serieId),
  });
