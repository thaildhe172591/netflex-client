import Hls from "hls.js";

export async function generateThumbnailFromHls(
  url: string
): Promise<string | null> {
  return new Promise((resolve) => {
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

    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(url);
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
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = url;
      video.addEventListener("loadedmetadata", () => {
        video.currentTime = 5;
      });
      video.onseeked = captureThumbnail;
    } else {
      resolve(null);
    }
  });
}
