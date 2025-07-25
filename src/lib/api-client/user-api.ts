import {
  ChangePasswordPayload,
  CreateUserPayload,
  FollowPayload,
  UnfollowPayload,
  GetFollowParams,
  GetNotificationsParams,
  GetReviewParams,
  GetUsersParams,
  NotificationDto,
  PaginatedResult,
  ReportPayload,
  ReviewPayload,
  ReviewDto,
  UpdateUserPayload,
  UserDto,
  FollowDto,
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

  unfollow: (payload: UnfollowPayload) =>
    axiosClient.post("/users/unfollow", payload),

  getFollowStatus: (params: GetFollowParams) =>
    axiosClient.get<FollowDto>("/users/follow", { params }),

  report: (payload: ReportPayload) =>
    axiosClient.post("/users/report", payload),

  review: (payload: ReviewPayload) =>
    axiosClient.post("/users/review", payload),

  getReview: (params: GetReviewParams) =>
    axiosClient.get<ReviewDto>("/users/review", { params }),

  getNotifications: (params?: GetNotificationsParams) =>
    axiosClient.get<PaginatedResult<NotificationDto>>("/users/notifications", {
      params,
    }),

  markNotificationRead: (notificationId: number) =>
    axiosClient.post("/users/notifications/read", { notificationId }),

  markAllNotificationsRead: () =>
    axiosClient.post("/users/notifications/readall"),
};
