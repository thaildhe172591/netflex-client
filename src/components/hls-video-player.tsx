"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Hls from "hls.js";
import { cn } from "@/lib/utils";
import { toPlayableMediaUrl } from "@/lib/media-url";
import {
  Captions,
  CaptionsOff,
  Maximize2,
  Minimize2,
  PictureInPicture2,
  RefreshCw,
  Wifi,
} from "lucide-react";
import { Button } from "@/components/ui/button";

type SourceRefreshResult = string | null | undefined;

interface HlsVideoPlayerProps {
  src: string;
  className?: string;
  variant?: "default" | "cinematic";
  title?: string;
  poster?: string;
  refreshSource?: () => Promise<SourceRefreshResult>;
}

export function HlsVideoPlayer({
  src,
  className,
  variant = "default",
  title,
  poster,
  refreshSource,
}: HlsVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const bufferTimerRef = useRef<number | null>(null);
  const overlayTimeoutRef = useRef<number | null>(null);

  const [resolvedSrc, setResolvedSrc] = useState(src);
  const [hasError, setHasError] = useState(false);
  const [isBuffering, setIsBuffering] = useState(true);
  const [isReady, setIsReady] = useState(false);
  const [isRecovering, setIsRecovering] = useState(false);
  const [showOverlay, setShowOverlay] = useState(true);
  const [isTheater, setIsTheater] = useState(false);
  const [captionsEnabled, setCaptionsEnabled] = useState(true);
  const [seekDirection, setSeekDirection] = useState<"left" | "right" | null>(null);
  const [throughputMbps, setThroughputMbps] = useState<number | null>(null);

  const isHls = useMemo(
    () =>
      resolvedSrc?.toLowerCase().includes(".m3u8") ||
      resolvedSrc?.includes("/o/video-") ||
      resolvedSrc?.includes("/o/episode-"),
    [resolvedSrc]
  );
  const playableSrc = useMemo(() => toPlayableMediaUrl(resolvedSrc), [resolvedSrc]);

  useEffect(() => {
    setResolvedSrc(src);
  }, [src]);

  const cleanupHls = () => {
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }
  };

  useEffect(() => {
    const connection = (navigator as Navigator & {
      connection?: { downlink?: number };
    }).connection;

    if (typeof connection?.downlink === "number" && connection.downlink > 0) {
      setThroughputMbps(connection.downlink);
    }
  }, []);

  useEffect(() => {
    if (!resolvedSrc || !videoRef.current) return;

    setHasError(false);
    setIsReady(false);
    setIsBuffering(true);

    const video = videoRef.current;

    const handleReady = () => {
      setIsReady(true);
      setIsBuffering(false);
    };

    const handleWaiting = () => setIsBuffering(true);
    const handlePlaying = () => setIsBuffering(false);
    const handleError = () => {
      setHasError(true);
      setIsBuffering(false);
    };

    const trackThroughput = () => {
      if (!video.buffered.length) return;
      const bufferedEnd = video.buffered.end(video.buffered.length - 1);
      const deltaSeconds = bufferedEnd - video.currentTime;
      if (deltaSeconds <= 0) return;
      const roughMbps = Math.min(120, Math.max(0.2, deltaSeconds * 1.6));
      setThroughputMbps((prev) => {
        if (!prev) return roughMbps;
        return prev * 0.75 + roughMbps * 0.25;
      });
    };

    video.addEventListener("loadeddata", handleReady);
    video.addEventListener("canplay", handleReady);
    video.addEventListener("playing", handlePlaying);
    video.addEventListener("waiting", handleWaiting);
    video.addEventListener("progress", trackThroughput);
    video.addEventListener("error", handleError);

    cleanupHls();

    if (!isHls) {
      video.src = playableSrc;
      video.load();
    } else if (Hls.isSupported()) {
      const hls = new Hls();
      hlsRef.current = hls;

      hls.loadSource(resolvedSrc);
      hls.attachMedia(video);

      hls.on(Hls.Events.ERROR, async (_, data) => {
        console.error("[HlsVideoPlayer Error Details]:", data);
        if (!data.fatal) return;

        if (data.type === Hls.ErrorTypes.NETWORK_ERROR) {
          hls.startLoad();
          return;
        }

        if (data.type === Hls.ErrorTypes.MEDIA_ERROR) {
          hls.recoverMediaError();
          return;
        }

        setHasError(true);
        if (refreshSource) {
          setIsRecovering(true);
          const refreshed = await refreshSource();
          setIsRecovering(false);
          if (refreshed) {
            setResolvedSrc(refreshed);
          }
        }
      });
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = resolvedSrc;
      video.load();
    }

    if (bufferTimerRef.current) {
      window.clearTimeout(bufferTimerRef.current);
    }

    bufferTimerRef.current = window.setTimeout(() => {
      if (!video.paused) {
        setIsBuffering(video.readyState < 3);
      }
    }, 1000);

    return () => {
      cleanupHls();
      if (bufferTimerRef.current) {
        window.clearTimeout(bufferTimerRef.current);
      }
      video.removeEventListener("loadeddata", handleReady);
      video.removeEventListener("canplay", handleReady);
      video.removeEventListener("playing", handlePlaying);
      video.removeEventListener("waiting", handleWaiting);
      video.removeEventListener("progress", trackThroughput);
      video.removeEventListener("error", handleError);
    };
  }, [resolvedSrc, isHls, playableSrc, refreshSource]);

  useEffect(() => {
    if (!videoRef.current) return;
    const tracks = videoRef.current.textTracks;
    if (!tracks || tracks.length === 0) return;
    for (let i = 0; i < tracks.length; i += 1) {
      tracks[i].mode = captionsEnabled ? "showing" : "hidden";
    }
  }, [captionsEnabled]);

  useEffect(() => {
    return () => {
      if (overlayTimeoutRef.current) {
        window.clearTimeout(overlayTimeoutRef.current);
      }
    };
  }, []);

  const handleOverlayReveal = () => {
    setShowOverlay(true);
    if (overlayTimeoutRef.current) {
      window.clearTimeout(overlayTimeoutRef.current);
    }
    overlayTimeoutRef.current = window.setTimeout(() => {
      setShowOverlay(false);
    }, 2200);
  };

  const handleSeek = (delta: number) => {
    if (!videoRef.current) return;
    const next = Math.min(
      videoRef.current.duration || Infinity,
      Math.max(0, videoRef.current.currentTime + delta)
    );
    videoRef.current.currentTime = next;
    setSeekDirection(delta < 0 ? "left" : "right");
    window.setTimeout(() => setSeekDirection(null), 500);
  };

  const handlePiP = async () => {
    const video = videoRef.current as HTMLVideoElement | null;
    if (!video || !document.pictureInPictureEnabled) return;
    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      } else {
        await video.requestPictureInPicture();
      }
    } catch (error) {
      console.error("PiP error", error);
    }
  };

  const handleRetry = async () => {
    setHasError(false);
    setIsBuffering(true);

    if (refreshSource) {
      setIsRecovering(true);
      const refreshed = await refreshSource();
      setIsRecovering(false);
      if (refreshed) {
        setResolvedSrc(refreshed);
        return;
      }
    }

    setResolvedSrc((current) => `${current}`);
    if (videoRef.current) {
      videoRef.current.load();
    }
  };

  const networkLabel = useMemo(() => {
    if (!throughputMbps) return "Estimating network...";
    if (throughputMbps >= 12) return `Excellent ${throughputMbps.toFixed(1)} Mbps`;
    if (throughputMbps >= 6) return `Stable ${throughputMbps.toFixed(1)} Mbps`;
    if (throughputMbps >= 2) return `Limited ${throughputMbps.toFixed(1)} Mbps`;
    return `Poor ${throughputMbps.toFixed(1)} Mbps`;
  }, [throughputMbps]);

  const errorText = "Video cannot be loaded. Check URL/CORS or refresh signed link.";

  if (variant === "default") {
    return (
      <div className={cn("relative", className)}>
        <video
          ref={videoRef}
          controls
          preload="metadata"
          className={cn(
            "w-full h-full transition-opacity duration-400",
            isReady ? "opacity-100" : "opacity-0"
          )}
          key={playableSrc}
        />
        {!isReady && (
          <div className="absolute inset-0 skeleton-shimmer rounded-lg flex items-center justify-center text-xs text-muted-foreground">
            Preparing stream...
          </div>
        )}
        {isBuffering && isReady && (
          <div className="absolute left-3 top-3 rounded-full border border-white/15 bg-black/60 px-3 py-1 text-xs text-white">
            Pre-buffering
          </div>
        )}
        {hasError && (
          <div className="mt-2 flex items-center gap-2 text-sm text-red-400">
            <span>{errorText}</span>
            <Button type="button" size="sm" variant="outline" onClick={handleRetry}>
              Retry
            </Button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-white/10 bg-black/60",
        isTheater && "lg:-mx-10 lg:rounded-none",
        className
      )}
    >
      <div
        className="absolute inset-0 opacity-60"
        style={
          poster
            ? {
              backgroundImage: `url(${poster})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              filter: "blur(40px)",
            }
            : undefined
        }
      />
      <div className="relative aspect-video">
        {!isReady && (
          <div className="absolute inset-0 z-10 skeleton-shimmer flex items-center justify-center">
            <div className="rounded-full border border-white/20 bg-black/55 px-4 py-2 text-xs text-white/80">
              Preparing playback...
            </div>
          </div>
        )}
        <video
          ref={videoRef}
          controls
          preload="metadata"
          className={cn(
            "w-full h-full transition-opacity duration-500",
            isReady ? "opacity-100" : "opacity-0"
          )}
          poster={poster}
          key={playableSrc}
          onMouseMove={handleOverlayReveal}
          onFocus={handleOverlayReveal}
          onTouchStart={handleOverlayReveal}
        />
        <div className="absolute inset-x-0 top-0 bottom-14 flex text-white/80">
          <button
            type="button"
            className="flex-1"
            aria-label="Rewind 10 seconds"
            onDoubleClick={() => handleSeek(-10)}
          />
          <button
            type="button"
            className="flex-1"
            aria-label="Forward 10 seconds"
            onDoubleClick={() => handleSeek(10)}
          />
        </div>

        {isBuffering && isReady && !hasError && (
          <div className="absolute left-4 top-4 rounded-full border border-white/15 bg-black/65 px-3 py-1 text-xs text-white">
            Pre-buffering stream...
          </div>
        )}

        {seekDirection && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="glass-panel rounded-full px-4 py-2 text-xs">
              {seekDirection === "left" ? "-10s" : "+10s"}
            </div>
          </div>
        )}

        <div
          className={cn(
            "absolute left-4 right-4 top-4 flex items-center justify-between gap-3 transition-opacity",
            showOverlay ? "opacity-100" : "opacity-0 pointer-events-none"
          )}
        >
          <div className="glass-panel rounded-full px-4 py-2 text-xs text-foreground">
            {title || "Now Playing"}
          </div>
          <div className="flex items-center gap-2">
            <div className="glass-panel hidden md:flex items-center gap-2 rounded-full px-3 py-2 text-xs text-foreground">
              <Wifi className="h-3.5 w-3.5" />
              {networkLabel}
            </div>
            <button
              type="button"
              className="glass-panel rounded-full p-2 text-foreground hover:text-white"
              onClick={() => setCaptionsEnabled((prev) => !prev)}
              aria-label="Toggle subtitles"
            >
              {captionsEnabled ? (
                <Captions className="h-4 w-4" />
              ) : (
                <CaptionsOff className="h-4 w-4" />
              )}
            </button>
            <button
              type="button"
              className="glass-panel rounded-full p-2 text-foreground hover:text-white"
              onClick={handlePiP}
              aria-label="Picture in picture"
            >
              <PictureInPicture2 className="h-4 w-4" />
            </button>
            <button
              type="button"
              className="glass-panel rounded-full p-2 text-foreground hover:text-white"
              onClick={() => setIsTheater((prev) => !prev)}
              aria-label="Toggle theater mode"
            >
              {isTheater ? (
                <Minimize2 className="h-4 w-4" />
              ) : (
                <Maximize2 className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>
      </div>

      {hasError && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/80 p-6">
          <div className="glass-panel-strong max-w-md rounded-2xl p-5 text-center space-y-3">
            <p className="text-sm text-white/90">{errorText}</p>
            <p className="text-xs text-muted-foreground">
              Common causes: expired signed URL, blocked hotlink, CORS, or unavailable Range response.
            </p>
            <Button type="button" onClick={handleRetry} disabled={isRecovering}>
              {isRecovering ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Refreshing link...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4" />
                  Retry playback
                </>
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
