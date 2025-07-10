import { useMutation } from "@tanstack/react-query";
import { keywordApi } from "@/lib/api-client/keyword-api";
import { CreateKeywordPayload } from "@/models/keyword";
import { QueryKeys } from "@/constants";

export const useCreateKeyword = () =>
  useMutation({
    mutationKey: [QueryKeys.KEYWORDS, "create"],
    mutationFn: (payload: CreateKeywordPayload) => keywordApi.create(payload),
  });

export const useUpdateKeyword = () =>
  useMutation({
    mutationKey: [QueryKeys.KEYWORDS, "update"],
    mutationFn: ({ keywordId, payload }: { keywordId: string; payload: CreateKeywordPayload }) =>
      keywordApi.update(keywordId, payload),
  });

export const useDeleteKeyword = () =>
  useMutation({
    mutationKey: [QueryKeys.KEYWORDS, "delete"],
    mutationFn: (keywordId: string) => keywordApi.delete(keywordId),
  });