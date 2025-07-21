export interface CreateUserPayload {
  email: string;
  password: string;
}

export interface UpdateUserPayload {
  email?: string;
  password?: string;
}

export interface ChangePasswordPayload {
  oldPassword: string;
  newPassword: string;
}

export interface UserDetailDto {
  email: string;
  confirmed: boolean;
  roles: string[];
  permissions: string[];
}

export interface UserDto {
  id: string;
  email: string;
  confirmed: boolean;
  roles: string;
  permissions: string;
}

export interface FollowPayload {
  targetId: string;
  targetType: string;
}

export interface ReportPayload {
  reason: string;
  description?: string;
}

export interface ReviewPayload {
  userId: string;
  targetId: string;
  targetType: string;
  rating: number;
}

export interface GetUsersParams {
  search?: string;
  pageIndex?: number;
  pageSize?: number;
}

export interface GetNotificationsParams {
  search?: string;
  sortBy?: string;
  pageIndex?: number;
  pageSize?: number;
}
