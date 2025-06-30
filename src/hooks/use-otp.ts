import { QueryKeys } from "@/constants";
import { authApi } from "@/lib/api-client";
import {
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from "@tanstack/react-query";

type InfoMutationOptions = Omit<
  UseMutationOptions<unknown, unknown, string>,
  "mutationFn"
>;

export const useSendOTP = (options: InfoMutationOptions = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: (email: string) => authApi.sendOTP(email),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: [QueryKeys.USER_INFO] }),
  });
};
