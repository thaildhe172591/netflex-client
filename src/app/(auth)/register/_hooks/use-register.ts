import { userApi } from "@/lib/api-client";
import { CreateUserPayload } from "@/models";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";

type InfoMutationOptions = Omit<
  UseMutationOptions<unknown, unknown, CreateUserPayload>,
  "mutationFn"
>;

export const useRegister = (options: InfoMutationOptions = {}) => {
  return useMutation({
    mutationFn: (payload: CreateUserPayload) => userApi.create(payload),
    ...options,
  });
};
