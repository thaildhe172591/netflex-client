export function shouldProxyMediaUrl(url?: string | null): boolean {
  if (!url) return false;
  const trimmed = url.trim();
  if (!trimmed) return false;
  if (trimmed.startsWith("/api/proxy")) return false;
  if (trimmed.startsWith("blob:") || trimmed.startsWith("data:")) return false;

  try {
    const parsed = new URL(trimmed, "http://localhost");
    if (parsed.protocol === "http:" || parsed.protocol === "https:") {
      return !parsed.pathname.toLowerCase().endsWith(".m3u8");
    }
  } catch {
    return false;
  }

  return false;
}

export function toPlayableMediaUrl(url: string): string {
  if (!shouldProxyMediaUrl(url)) return url;
  return `/api/proxy?url=${encodeURIComponent(url)}`;
}
