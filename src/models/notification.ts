export interface NotificationDto {
  id: number;
  title: string;
  content: string;
  createdAt: string;
}

export interface CreateNotificationPayload {
  title: string;
  content: string;
}

export interface NotificationFilter {
  search?: string;
  pageIndex?: number;
  pageSize?: number;
}
