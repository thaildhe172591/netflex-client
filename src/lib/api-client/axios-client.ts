import axios from "axios";
import { getDeviceId } from "@/lib/device";
import { useLoadingStore } from "@/stores/loading-store";

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
    await axiosClient.post(
      "/auth/refresh",
      { deviceId },
      {
        // Do not recurse refresh logic and do not show global API indicator for silent token renewal.
        _skipAuthRefresh: true,
        _skipGlobalLoading: true,
      } as never
    );
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

const startGlobalApiLoading = (config: unknown) => {
  const typedConfig = config as { _skipGlobalLoading?: boolean; _hasGlobalLoading?: boolean };
  if (typedConfig._skipGlobalLoading) return;
  typedConfig._hasGlobalLoading = true;
  useLoadingStore.getState().startApiLoading();
};

const stopGlobalApiLoading = (config: unknown) => {
  const typedConfig = config as { _hasGlobalLoading?: boolean };
  if (!typedConfig?._hasGlobalLoading) return;
  typedConfig._hasGlobalLoading = false;
  useLoadingStore.getState().stopApiLoading();
};

const getRequestPath = (url: unknown) => {
  if (typeof url !== "string") return "";
  if (url.startsWith("http")) {
    try {
      return new URL(url).pathname;
    } catch {
      return url;
    }
  }
  return url;
};

axiosClient.interceptors.request.use(
  (config) => {
    startGlobalApiLoading(config);
    return config;
  },
  (error) => {
    stopGlobalApiLoading(error?.config);
    return Promise.reject(error);
  }
);

axiosClient.interceptors.response.use(
  (response) => {
    stopGlobalApiLoading(response.config);
    return response;
  },
  async (error) => {
    const { response, config } = error;
    stopGlobalApiLoading(config);
    const status = response?.status;
    const requestPath = getRequestPath(config?.url);
    const isRefreshRequest = requestPath.includes("/auth/refresh");
    const shouldSkipRefresh = !!config?._skipAuthRefresh || isRefreshRequest;
    const shouldRenewToken = status === 401 && !config?._retry && !shouldSkipRefresh;
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
