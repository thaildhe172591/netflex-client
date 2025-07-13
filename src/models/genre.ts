import { PaginationRequest } from "@/models/pagination";

export interface Genre {
  id: number;
  name: string;
}

export interface CreateGenrePayload {
  name: string;
}

export interface GenreFilter extends PaginationRequest {
  search?: string;
  sortBy?: string;
}
