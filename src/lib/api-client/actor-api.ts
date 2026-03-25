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
    const response = await axiosClient.get(`/actors/${actorId}`);
    const body = response.data as
      | { success?: boolean; data?: unknown }
      | Record<string, unknown>;

    const payload =
      body && typeof body === "object" && "success" in body && "data" in body
        ? (body as { data: unknown }).data
        : body;

    const item = (payload ?? {}) as Partial<{
      id: string | number;
      name: string;
      gender: boolean;
      birthDate: string;
      biography: string;
      about: string;
      image: string;
      photo: string;
    }>;

    return {
      id: item.id ?? "",
      name: item.name ?? "",
      gender: item.gender ?? true,
      birthDate: item.birthDate,
      biography: item.biography ?? item.about,
      image: item.image ?? item.photo,
    } as Actor;
  },
  getAll: async (request: ActorFilter) => {
    const response = await axiosClient.get(`/actors`, {
      params: request,
    });

    const body = response.data as
      | { success?: boolean; data?: unknown }
      | Record<string, unknown>;

    const payload =
      body && typeof body === "object" && "success" in body && "data" in body
        ? (body as { data: unknown }).data
        : body;

    const paged = (payload ?? {}) as Partial<{
      pageIndex: number;
      pageSize: number;
      total: number;
      totalCount: number;
      data: Array<Record<string, unknown>>;
      items: Array<Record<string, unknown>>;
      Items: Array<Record<string, unknown>>;
    }>;

    const rawItems = Array.isArray(paged.data)
      ? paged.data
      : Array.isArray(paged.items)
        ? paged.items
        : Array.isArray(paged.Items)
          ? paged.Items
          : [];

    const normalizedItems = rawItems.map((item) => ({
      id: (item.id as string | number | undefined) ?? "",
      name: (item.name as string | undefined) ?? "",
      gender: (item.gender as boolean | undefined) ?? true,
      birthDate: item.birthDate as string | undefined,
      biography: (item.biography as string | undefined) ?? (item.about as string | undefined),
      image: (item.image as string | undefined) ?? (item.photo as string | undefined),
    })) as Actor[];

    return {
      pageIndex: paged.pageIndex ?? request.pageIndex ?? 1,
      pageSize: paged.pageSize ?? request.pageSize ?? 10,
      total: paged.total ?? paged.totalCount ?? normalizedItems.length,
      data: normalizedItems,
    } as PaginatedResult<Actor>;
  },
};
