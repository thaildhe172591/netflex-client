export function buildApiUrl(path: string) {
  const rawBaseUrl = process.env.BASE_API_URL ?? "";
  if (!rawBaseUrl) {
    throw new Error("BASE_API_URL is not configured");
  }

  const baseUrl = rawBaseUrl.replace(/\/+$/, "");
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  if (baseUrl.endsWith("/api/v1") && normalizedPath.startsWith("/api/v1/")) {
    return `${baseUrl}${normalizedPath.substring("/api/v1".length)}`;
  }

  return `${baseUrl}${normalizedPath}`;
}
