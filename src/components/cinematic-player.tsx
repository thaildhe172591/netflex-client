import { HlsVideoPlayer } from "./hls-video-player";

interface CinematicPlayerProps {
  src: string;
  title?: string;
  poster?: string;
  className?: string;
  refreshSource?: () => Promise<string | null | undefined>;
}

export function CinematicPlayer({
  src,
  title,
  poster,
  className,
  refreshSource,
}: CinematicPlayerProps) {
  return (
    <HlsVideoPlayer
      src={src}
      title={title}
      poster={poster}
      className={className}
      variant="cinematic"
      refreshSource={refreshSource}
    />
  );
}
