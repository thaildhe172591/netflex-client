export type Actor = {
  id: number;
  name: string;
  gender: boolean;
  birthDate?: string;
  biography?: string;
  image?: string;
};

export type CreateActorPayload = {
  name: string;
  gender: boolean;
  image?: File;
  birthDate?: Date;
  biography?: string;
};

export type ActorFilter = {
  search?: string;
  sortBy?: string;
  pageIndex?: number;
  pageSize?: number;
};

export type UpdateActorPayload = {
  name?: string;
  image?: File;
  gender?: boolean;
  birthDate?: Date;
  biography?: string;
};

export type GetActorsResponse = {
  data: Actor[];
  pageIndex: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
};
