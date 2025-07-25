import { useQuery } from "@tanstack/react-query";
import { userApi } from "@/lib/api-client";
import { GetUsersParams } from "@/models";
import { QueryKeys } from "@/constants";

type UserQueryOptions = Omit<unknown, "queryKey" | "queryFn">;

export const useUsers = (
  request: GetUsersParams = {},
  options: UserQueryOptions = {}
) =>
  useQuery({
    ...options,
    queryKey: [QueryKeys.USERS, request],
    queryFn: () => userApi.getAll(request),
  });
