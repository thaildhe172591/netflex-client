import {
  CreateNotificationPayload,
  NotificationDto,
  NotificationFilter,
} from "@/models";
import { PaginatedResult } from "@/models/pagination";
import axiosClient from "./axios-client";

export const notificationApi = {
  create: (payload: CreateNotificationPayload) =>
    axiosClient.post<{ id: number }>("/notifications", payload),

  getAll: (params?: NotificationFilter) =>
    axiosClient.get<PaginatedResult<NotificationDto>>("/notifications", {
      params,
    }),

  delete: (id: number) => axiosClient.delete(`/notifications/${id}`),
};
