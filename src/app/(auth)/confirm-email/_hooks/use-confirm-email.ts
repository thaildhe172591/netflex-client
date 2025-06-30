import { authApi } from "@/lib/api-client";
import { ConfirmEmailPayload } from "@/models";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";

type InfoMutationOptions = Omit<
  UseMutationOptions<unknown, unknown, ConfirmEmailPayload>,
  "mutationFn"
>;

export const useConfirmEmail = (options: InfoMutationOptions = {}) => {
  return useMutation({
    ...options,
    mutationFn: (payload: ConfirmEmailPayload) => authApi.confirmEmail(payload),
  });
};
