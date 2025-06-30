import {
  useQuery,
  useMutation,
  useQueryClient,
  UseQueryOptions,
} from "@tanstack/react-query";
import { authApi } from "@/lib/api-client";
import {
  CallbackLoginSocialPayload,
  LoginPayload,
  LogoutPayload,
  UserInfo,
} from "@/models";
import { QueryKeys } from "@/constants";

type InfoQueryOptions = Omit<
  UseQueryOptions<UserInfo>,
  "queryKey" | "queryFn" | "retry"
>;

export const useAuth = (options: InfoQueryOptions = {}) => {
  const queryClient = useQueryClient();

  const query = useQuery({
    ...options,
    queryKey: [QueryKeys.USER_INFO],
    queryFn: () => authApi.getInfo(),
    retry: false,
  });

  const signinMutation = useMutation({
    mutationFn: (payload: LoginPayload) => authApi.signin(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.USER_INFO] });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: (payload: LogoutPayload) => authApi.logout(payload),
    onSuccess: () => {
      queryClient.setQueryData([QueryKeys.USER_INFO], null);
    },
  });

  const callbackLoginSocialMutation = useMutation({
    mutationFn: (payload: CallbackLoginSocialPayload) =>
      authApi.callbackLoginSocial(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.USER_INFO] });
    },
  });

  return {
    ...query,
    signin: signinMutation.mutateAsync,
    logout: logoutMutation.mutateAsync,
    callbackLoginSocial: callbackLoginSocialMutation.mutateAsync,
  };
};
