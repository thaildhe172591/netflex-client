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

type ApiEnvelope<T> = {
  success: boolean;
  data: T;
  error: unknown;
};

const unwrap = <T>(payload: T | ApiEnvelope<T>): T => {
  if (
    payload &&
    typeof payload === "object" &&
    "success" in payload &&
    "data" in payload
  ) {
    return (payload as ApiEnvelope<T>).data;
  }
  return payload as T;
};

export const userApi = {
  create: (payload: CreateUserPayload) => axiosClient.post("/users", payload),

  getAll: (params?: GetUsersParams) =>
    axiosClient.get<PaginatedResult<UserDto>>("/users", { params }),

  update: (id: string, payload: UpdateUserPayload) =>
    axiosClient.put(`/users/${id}`, payload),

  changePassword: (payload: ChangePasswordPayload) =>
    axiosClient.post("/users/change-password", payload),

  follow: async (payload: FollowPayload) => {
    const response = await axiosClient.post<FollowDto | ApiEnvelope<FollowDto>>(
      "/users/follow",
      payload
    );
    return unwrap(response.data);
  },

  unfollow: async (payload: UnfollowPayload) => {
    const response = await axiosClient.post<FollowDto | ApiEnvelope<FollowDto>>(
      "/users/unfollow",
      payload
    );
    return unwrap(response.data);
  },

  getFollowStatus: async (params: GetFollowParams) => {
    const response = await axiosClient.get<FollowDto | ApiEnvelope<FollowDto>>(
      "/users/follow",
      { params }
    );
    return unwrap(response.data);
  },

  report: async (payload: ReportPayload) => {
    const response = await axiosClient.post<
      Record<string, unknown> | ApiEnvelope<Record<string, unknown>>
    >("/users/report", payload);
    return unwrap(response.data);
  },

  review: async (payload: ReviewPayload) => {
    const response = await axiosClient.post<ReviewDto | ApiEnvelope<ReviewDto>>(
      "/users/review",
      payload
    );
    return unwrap(response.data);
  },

  getReview: async (params: GetReviewParams) => {
    const response = await axiosClient.get<ReviewDto | ApiEnvelope<ReviewDto>>(
      "/users/review",
      { params }
    );
    return unwrap(response.data);
  },

  getNotifications: (params?: GetNotificationsParams) =>
    axiosClient.get<PaginatedResult<NotificationDto>>("/users/notifications", {
      params,
    }),

  markNotificationRead: (notificationId: string) =>
    axiosClient.post("/users/notifications/read", { notificationId }),

  markAllNotificationsRead: () =>
    axiosClient.post("/users/notifications/readall"),

  assignRole: (payload: { userId: string; roleName: string }) =>
    axiosClient.post("/users/roles", payload),
};
