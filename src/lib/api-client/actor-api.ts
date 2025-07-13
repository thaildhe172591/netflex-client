import { CreateActorPayload, Actor, UpdateActorPayload } from "@/models/actor";
import { ActorFilter } from "@/models/actor";
import axiosClient from "./axios-client";
import { PaginatedResult } from "@/models/pagination";
import { serialize } from "../serialize-form-data";

export const actorApi = {
  create: (payload: CreateActorPayload) =>
    axiosClient.post("/actors", serialize(payload)),
  update: (actorId: string, payload: UpdateActorPayload) =>
    axiosClient.put(`/actors/${actorId}`, serialize(payload)),
  delete: (actorId: string) => axiosClient.delete(`/actors/${actorId}`),
  getAll: async (request: ActorFilter) => {
    const response = await axiosClient.get<PaginatedResult<Actor>>(`/actors`, {
      params: request,
    });
    return response.data;
  },
};
