import { CreateActorPayload, Actor, UpdateActorPayload } from "@/models/actor";
import { ActorQueryable } from "@/models/actor";
import axiosClient from "./axios-client";
import { serialize } from "object-to-formdata";
import { PaginatedResult } from "@/models/pagination";

export const actorApi = {
  create: (payload: CreateActorPayload) =>
    axiosClient.post("/actors", serialize(payload, { indices: true })),
  update: (actorId: string, payload: UpdateActorPayload) =>
    axiosClient.put(
      `/actors/${actorId}`,
      serialize(payload, { indices: true })
    ),
  delete: (actorId: string) => axiosClient.delete(`/actors/${actorId}`),
  getAll: async (request: ActorQueryable) => {
    const response = await axiosClient.get<PaginatedResult<Actor>>(`/actors`, {
      params: request,
    });
    return response.data;
  },
};
