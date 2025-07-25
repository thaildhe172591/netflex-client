import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userApi } from "@/lib/api-client";
import { QueryKeys } from "@/constants";

export interface AssignRolePayload {
  userId: string;
  roleName: string;
}

export const useAssignRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: AssignRolePayload) => userApi.assignRole(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.USERS],
      });
    },
    onError: (
      error: Error | { response?: { data?: { message?: string } } }
    ) => {
      console.error("Failed to assign role:", error);
    },
  });
};
