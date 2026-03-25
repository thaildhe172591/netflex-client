import Hls from "hls.js";
import { toPlayableMediaUrl } from "@/lib/media-url";

export async function generateThumbnailFromHls(
  url: string
): Promise<string | null> {
  return new Promise((resolve) => {
    const isHls = url.toLowerCase().includes(".m3u8");
    const resolvedUrl = isHls ? url : toPlayableMediaUrl(url);
    const video = document.createElement("video");
    video.crossOrigin = "anonymous";
    video.muted = true;
    video.playsInline = true;

    const canvas = document.createElement("canvas");

    const captureThumbnail = () => {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) return resolve(null);
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const thumbnail = canvas.toDataURL("image/jpeg");
      resolve(thumbnail);
    };

    if (isHls && Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(resolvedUrl);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.currentTime = 5;
      });

      video.onseeked = () => {
        captureThumbnail();
        hls.destroy();
      };

      hls.on(Hls.Events.ERROR, (_, data) => {
        console.error("HLS error", data);
        resolve(null);
      });
    } else if (isHls && video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = resolvedUrl;
      video.addEventListener("loadedmetadata", () => {
        video.currentTime = 5;
      });
      video.onseeked = captureThumbnail;
    } else {
      video.src = resolvedUrl;
      video.addEventListener("loadedmetadata", () => {
        video.currentTime = Math.min(5, Math.max(0, video.duration / 4));
      });
      video.onseeked = captureThumbnail;
    }
  });
}
