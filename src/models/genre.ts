import { PaginationRequest } from "@/models/pagination";

export interface Genre {
  id: number;
  name: string;
}

export interface CreateGenrePayload {
  name: string;
}

export interface GenreQueryable extends PaginationRequest {
  search?: string;
  sortBy?: string;
}

export interface GenreQueryable extends PaginationRequest {
  search?: string;
  sortBy?: string;
}
