export interface PaginationRequest {
  pageIndex?: number;
  pageSize?: number;
}

export interface PaginatedResult<T> {
  pageIndex: number;
  pageSize: number;
  total: number;
  data: T[];
}
