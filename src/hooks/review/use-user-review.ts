import { useQuery } from "@tanstack/react-query";
import { userApi } from "@/lib/api-client/user-api";
import { QueryKeys } from "@/constants/query-keys";
import { GetReviewParams } from "@/models";

export const useUserReview = (params: GetReviewParams) => {
  return useQuery({
    queryKey: [QueryKeys.USER_REVIEW, params.targetId, params.targetType],
    queryFn: () => userApi.getReview(params),
    enabled: !!params.targetId && !!params.targetType,
    retry: false,
  });
};
