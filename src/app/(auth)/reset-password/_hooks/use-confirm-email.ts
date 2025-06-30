import { authApi } from "@/lib/api-client";
import { ResetPasswordPayload } from "@/models";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";

type InfoMutationOptions = Omit<
  UseMutationOptions<unknown, unknown, ResetPasswordPayload>,
  "mutationFn"
>;

export const useResetPassword = (options: InfoMutationOptions = {}) => {
  return useMutation({
    ...options,
    mutationFn: (payload: ResetPasswordPayload) =>
      authApi.resetPassword(payload),
  });
};
