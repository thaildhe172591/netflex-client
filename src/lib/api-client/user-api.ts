import {
  ChangePasswordPayload,
  CreateUserPayload,
  FollowPayload,
  GetNotificationsParams,
  GetUsersParams,
  NotificationDto,
  PaginatedResult,
  ReportPayload,
  ReviewPayload,
  UpdateUserPayload,
  UserDto,
} from "@/models";
import axiosClient from "./axios-client";

export const userApi = {
  create: (payload: CreateUserPayload) =>
    axiosClient.post<{ id: number }>("/users", payload),

  getAll: (params?: GetUsersParams) =>
    axiosClient.get<PaginatedResult<UserDto>>("/users", { params }),

  update: (id: string, payload: UpdateUserPayload) =>
    axiosClient.put(`/users/${id}`, payload),

  changePassword: (payload: ChangePasswordPayload) =>
    axiosClient.post("/users/change-password", payload),

  follow: (payload: FollowPayload) =>
    axiosClient.post("/users/follow", payload),

  unfollow: (payload: FollowPayload) =>
    axiosClient.post("/users/unfollow", payload),

  report: (payload: ReportPayload) =>
    axiosClient.post("/users/report", payload),

  review: (payload: ReviewPayload) =>
    axiosClient.post("/users/review", payload),

  getNotifications: (params?: GetNotificationsParams) =>
    axiosClient.get<PaginatedResult<NotificationDto>>("/users/notifications", {
      params,
    }),

  markNotificationRead: (notificationId: number) =>
    axiosClient.post("/users/notifications/read", { notificationId }),

  markAllNotificationsRead: () =>
    axiosClient.post("/users/notifications/readall"),
};
