import { CreateKeywordPayload, Keyword, KeywordQueryable } from "@/models";
import axiosClient from "./axios-client";
import { serialize } from "object-to-formdata";
import { PaginatedResult } from "@/models/pagination";

export const keywordApi = {
  create: (payload: CreateKeywordPayload) =>
    axiosClient.post("/keywords", serialize(payload)),
  update: (keywordId: string, payload: CreateKeywordPayload) =>
    axiosClient.put(`/keywords/${keywordId}`, serialize(payload)),
  delete: (keywordId: string) => axiosClient.delete(`/keywords/${keywordId}`),
  getAll: async (request: KeywordQueryable) => {
    const response = await axiosClient.get<PaginatedResult<Keyword>>(
      `/keywords`,
      {
        params: request,
      }
    );
    return response.data;
  },
};
