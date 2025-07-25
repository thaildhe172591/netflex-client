import { useQuery } from "@tanstack/react-query";
import { userApi } from "@/lib/api-client/user-api";
import { QueryKeys } from "@/constants/query-keys";
import { GetFollowParams } from "@/models";

export const useFollowStatus = (params: GetFollowParams) => {
  return useQuery({
    queryKey: [QueryKeys.FOLLOW_STATUS, params.targetId, params.targetType],
    queryFn: () => userApi.getFollowStatus(params),
    enabled: !!params.targetId && !!params.targetType,
    retry: false,
  });
};
