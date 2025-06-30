import { v4 as uuidv4 } from "uuid";

export function getDeviceId(): string {
  if (typeof window === "undefined") return "unknown-device";

  const key = "device_id";
  let deviceId = localStorage.getItem(key);

  if (!deviceId) {
    deviceId = uuidv4();
    localStorage.setItem(key, deviceId);
  }

  return deviceId;
}
