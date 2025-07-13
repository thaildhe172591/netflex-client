import { PaginationRequest } from "@/models/pagination";

export interface CreateKeywordPayload {
  name: string;
}

export interface Keyword {
  id: number;
  name: string;
}

export interface KeywordFilter extends PaginationRequest {
  search?: string;
  sortBy?: string;
}
