export interface LoginPayload {
  email: string;
  password: string;
  deviceId: string;
}

export interface CallbackLoginSocialPayload {
  provider: string;
  code: string;
  redirectUrl: string;
  deviceId: string;
}

export interface VerifyOTPPayload {
  email: string;
  otp: string;
}

export interface LogoutPayload {
  deviceId: string;
}

export interface ConfirmEmailPayload {
  email: string;
  otp: string;
}

export interface ResetPasswordPayload {
  email: string;
  otp: string;
  newpassword: string;
}

export interface UserInfo {
  email: string;
  roles: string[];
  permission: string[];
}
