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
        isFollow: true,
        targetId: variables.targetId,
        targetType: variables.targetType,
        followedAt: new Date().toISOString(),
      };

      queryClient.setQueryData(
        [QueryKeys.FOLLOW_STATUS, variables.targetId, variables.targetType],
        optimisticFollowData
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

      const optimisticUnfollowData: FollowDto = {
        isFollow: false,
        targetId: variables.targetId,
        targetType: variables.targetType,
      };

      queryClient.setQueryData(
        [QueryKeys.FOLLOW_STATUS, variables.targetId, variables.targetType],
        optimisticUnfollowData
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
