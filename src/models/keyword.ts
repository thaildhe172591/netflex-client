import { PaginationRequest } from "@/models/pagination";

export interface CreateKeywordPayload {
  name: string;
}

export interface Keyword {
  id: number;
  name: string;
}

export interface KeywordQueryable extends PaginationRequest {
  search?: string;
  sortBy?: string;
}

export interface KeywordQueryable extends PaginationRequest {
  search?: string;
  sortBy?: string;
}
