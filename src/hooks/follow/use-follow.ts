import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userApi } from "@/lib/api-client/user-api";
import { QueryKeys } from "@/constants/query-keys";
import { FollowPayload, UnfollowPayload, FollowDto } from "@/models";

export const useFollow = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: FollowPayload) => userApi.follow(payload),
    onMutate: async (variables) => {
      await queryClient.cancelQueries({
        queryKey: [
          QueryKeys.FOLLOW_STATUS,
          variables.targetId,
          variables.targetType,
        ],
      });

      const previousStatus = queryClient.getQueryData([
        QueryKeys.FOLLOW_STATUS,
        variables.targetId,
        variables.targetType,
      ]);

      const optimisticFollowData: FollowDto = {
        targetId: variables.targetId,
        targetType: variables.targetType,
        userId: "",
        createdAt: new Date(),
      };

      queryClient.setQueryData(
        [QueryKeys.FOLLOW_STATUS, variables.targetId, variables.targetType],
        { data: optimisticFollowData }
      );

      return { previousStatus };
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(
        [QueryKeys.FOLLOW_STATUS, variables.targetId, variables.targetType],
        context?.previousStatus
      );
    },
    onSettled: (_, __, variables) => {
      queryClient.invalidateQueries({
        queryKey: [
          QueryKeys.FOLLOW_STATUS,
          variables.targetId,
          variables.targetType,
        ],
      });
    },
  });
};

export const useUnfollow = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UnfollowPayload) => userApi.unfollow(payload),
    onMutate: async (variables) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({
        queryKey: [
          QueryKeys.FOLLOW_STATUS,
          variables.targetId,
          variables.targetType,
        ],
      });

      // Snapshot the previous value
      const previousStatus = queryClient.getQueryData([
        QueryKeys.FOLLOW_STATUS,
        variables.targetId,
        variables.targetType,
      ]);

      // Optimistically update to "not following" (null/undefined)
      queryClient.setQueryData(
        [QueryKeys.FOLLOW_STATUS, variables.targetId, variables.targetType],
        undefined
      );

      // Return a context object with the snapshotted value
      return { previousStatus };
    },
    onError: (err, variables, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      queryClient.setQueryData(
        [QueryKeys.FOLLOW_STATUS, variables.targetId, variables.targetType],
        context?.previousStatus
      );
    },
    onSettled: (_, __, variables) => {
      // Always refetch after error or success
      queryClient.invalidateQueries({
        queryKey: [
          QueryKeys.FOLLOW_STATUS,
          variables.targetId,
          variables.targetType,
        ],
      });
    },
  });
};
