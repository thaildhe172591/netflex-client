import { CreateUserPayload } from "@/models";
import axiosClient from "./axios-client";

export const userApi = {
  create: (payload: CreateUserPayload) => axiosClient.post("/users", payload),
};
