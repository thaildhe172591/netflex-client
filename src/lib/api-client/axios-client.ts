import axios from "axios";
import { getDeviceId } from "@/lib/device";

const axiosClient = axios.create({
  baseURL: "/api/v1",
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue: {
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}[] = [];

const processQueue = (error: unknown) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve();
    }
  });
  failedQueue = [];
};
const refreshToken = async () => {
  try {
    const deviceId = getDeviceId();
    await axiosClient.post("/auth/refresh", { deviceId });
    processQueue(null);
  } catch (error) {
    processQueue(error);
    throw error;
  }
};

const getNewToken = async () => {
  if (!isRefreshing) {
    isRefreshing = true;
    try {
      await refreshToken();
    } finally {
      isRefreshing = false;
    }
    return;
  }
  return new Promise((resolve, reject) => {
    failedQueue.push({ resolve, reject });
  });
};

axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const { response, config } = error;
    const status = response?.status;
    const shouldRenewToken = status === 401 && !config._retry;
    if (shouldRenewToken) {
      config._retry = true;
      try {
        await getNewToken();
        return axiosClient(config);
      } catch (error) {
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
