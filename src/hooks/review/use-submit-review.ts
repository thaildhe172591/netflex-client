import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userApi } from "@/lib/api-client/user-api";
import { QueryKeys } from "@/constants/query-keys";
import { ReviewPayload } from "@/models";

export const useSubmitReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ReviewPayload) => userApi.review(payload),
    onSuccess: (_, variables) => {
      // Invalidate user review query
      queryClient.invalidateQueries({
        queryKey: [
          QueryKeys.USER_REVIEW,
          variables.targetId,
          variables.targetType,
        ],
      });
      // Also invalidate movie details to refresh average rating
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.MOVIES, variables.targetId],
      });
    },
  });
};
