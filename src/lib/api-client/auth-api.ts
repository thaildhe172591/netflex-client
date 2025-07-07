import {
  ConfirmEmailPayload,
  LoginPayload,
  CallbackLoginSocialPayload,
  LogoutPayload,
  UserInfo,
  VerifyOTPPayload,
  ResetPasswordPayload,
} from "@/models";
import axiosClient from "./axios-client";

export const authApi = {
  signin: (payload: LoginPayload) => axiosClient.post("/auth/signin", payload),
  logout: (payload: LogoutPayload) => axiosClient.post("/auth/logout", payload),
  confirmEmail: (payload: ConfirmEmailPayload) =>
    axiosClient.post("/auth/confirm-email", payload),
  callbackLoginSocial: (payload: CallbackLoginSocialPayload) =>
    axiosClient.post(`/auth/${payload.provider}/callback`, payload),
  sendOTP: (email: string) => axiosClient.post("/auth/otp", { email }),
  resetPassword: (payload: ResetPasswordPayload) =>
    axiosClient.post("/auth/reset-password", payload),
  loginSocial: (provider: string) =>
    axiosClient.get(
      `/auth/${provider}?redirectUrl=${window.location.origin}/${provider}/callback`
    ),
  verifyOTP: (payload: VerifyOTPPayload) =>
    axiosClient.get(`/auth/otp?email=${payload.email}&otp=${payload.otp}`),
  getInfo: async () => {
    const response = await axiosClient.get<UserInfo>("/auth/me");
    return response.data;
  },
};
