export type Genre = {
  id: number;
  name: string;
};

export type CreateGenrePayload = {
  name: string;
};

export type GenreFilter = {
  search?: string;
  sortBy?: string;
  pageIndex?: number;
  pageSize?: number;
};
