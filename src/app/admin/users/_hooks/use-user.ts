import { useQuery } from "@tanstack/react-query";
import { userApi } from "@/lib/api-client";

interface UseUsersOptions {
  pageIndex?: number;
  pageSize?: number;
  search?: string;
}

export const useUsers = ({
  pageIndex = 1,
  pageSize = 10,
  search,
}: UseUsersOptions = {}) =>
  useQuery({
    queryKey: ["admin-users", { pageIndex, pageSize, search }],
    queryFn: () =>
      userApi.getAll({
        pageIndex,
        pageSize,
        search,
      }),
  });
