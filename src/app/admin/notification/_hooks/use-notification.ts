import { useQuery } from "@tanstack/react-query";
import { notificationApi } from "@/lib/api-client";
import { QueryKeys } from "@/constants";
import { NotificationFilter } from "@/models";

type NotificationQueryOptions = Omit<unknown, "queryKey" | "queryFn">;

export const useNotifications = (
  filter: NotificationFilter,
  options: NotificationQueryOptions = {}
) =>
  useQuery({
    queryKey: [QueryKeys.NOTIFICATIONS, filter],
    queryFn: () => notificationApi.getAll(filter),
    ...options,
  });
