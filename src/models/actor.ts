import { PaginationRequest } from "@/models/pagination";

export interface Actor {
  id: number;
  name: string;
  image?: string;
  gender?: boolean;
  birthDate?: Date;
  biography?: string;
}

export interface CreateActorPayload {
  name: string;
  gender?: boolean;
  image?: File;
  birthDate?: Date;
  biography?: string;
}

export interface UpdateActorPayload {
  name?: string;
  image?: File;
  gender?: boolean;
  birthDate?: Date;
  biography?: string;
}

export interface ActorFilter extends PaginationRequest {
  search?: string;
  sortBy?: string;
}

export interface ActorFilter extends PaginationRequest {
  search?: string;
  sortBy?: string;
}
