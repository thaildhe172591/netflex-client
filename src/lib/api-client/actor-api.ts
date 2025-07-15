import {
  Actor,
  CreateActorPayload,
  UpdateActorPayload,
  ActorFilter,
} from "@/models";
import axiosClient from "./axios-client";
import { serialize } from "../serialize-form-data";
import { PaginatedResult } from "@/models/pagination";

export const actorApi = {
  create: (payload: CreateActorPayload) =>
    axiosClient.post("/actors", serialize(payload)),
  update: (actorId: string, payload: UpdateActorPayload) =>
    axiosClient.put(`/actors/${actorId}`, serialize(payload)),
  delete: (actorId: string) => axiosClient.delete(`/actors/${actorId}`),

  get: async (actorId: string) => {
    const response = await axiosClient.get<Actor>(`/actors/${actorId}`);
    return response.data;
  },
  getAll: async (request: ActorFilter) => {
    const response = await axiosClient.get<PaginatedResult<Actor>>(`/actors`, {
      params: request,
    });
    return response.data;
  },
};
