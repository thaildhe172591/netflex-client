import { CreateKeywordPayload, Keyword, KeywordFilter } from "@/models";
import axiosClient from "./axios-client";
import { PaginatedResult } from "@/models/pagination";

export const keywordApi = {
  create: (payload: CreateKeywordPayload) =>
    axiosClient.post("/keywords", payload),
  update: (keywordId: string, payload: CreateKeywordPayload) =>
    axiosClient.put(`/keywords/${keywordId}`, payload),
  delete: (keywordId: string) => axiosClient.delete(`/keywords/${keywordId}`),
  getAll: async (request: KeywordFilter) => {
    const response = await axiosClient.get<PaginatedResult<Keyword>>(
      `/keywords`,
      {
        params: request,
      }
    );
    return response.data;
  },
};
