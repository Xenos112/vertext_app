import { useRef, useEffect, useCallback } from "react";
import Hls from "hls.js";
import * as dashjs from "dashjs";

type VideoFormat = "mp4" | "hls" | "dash";

interface VideoPlayerProps extends React.VideoHTMLAttributes<HTMLVideoElement> {
  src: string;
  type: VideoFormat;
  autoPlay?: boolean;
  controls?: boolean;
}

const VideoPlayer = ({
  src,
  type = "mp4",
  autoPlay = false,
  controls = true,
  ...rest
}: VideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const dashPlayerRef = useRef<dashjs.MediaPlayerClass | null>(null);

  const handlePlay = useCallback(() => {
    const video = videoRef.current;
    if (video && video.paused) {
      video.play().catch(() => {});
    }
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !src) return;

    let metadataListener: (() => void) | null = null;

    const initializePlayer = async () => {
      try {
        if (type === "hls") {
          if (video.canPlayType("application/vnd.apple.mpegurl")) {
            video.src = src;
            if (autoPlay) {
              video.play().catch(() => {});
            }
            return;
          }

          if (Hls.isSupported()) {
            hlsRef.current = new Hls();
            hlsRef.current.loadSource(src);
            hlsRef.current.attachMedia(video);
            hlsRef.current.on(Hls.Events.MANIFEST_PARSED, () => {
              if (autoPlay) {
                video.play().catch(() => {});
              }
            });
          }
        } else if (type === "dash") {
          dashPlayerRef.current = dashjs.MediaPlayer().create();
          dashPlayerRef.current.initialize(video, src, autoPlay);
        } else {
          video.src = src;
          metadataListener = () => {
            if (autoPlay) {
              video.play().catch(() => {});
            }
          };
          video.addEventListener("loadedmetadata", metadataListener);
        }
      } catch (error) {
        console.error("Error initializing video player:", error);
      }
    };

    initializePlayer();

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
      if (dashPlayerRef.current) {
        dashPlayerRef.current.reset();
        dashPlayerRef.current = null;
      }
      if (metadataListener && video) {
        video.removeEventListener("loadedmetadata", metadataListener);
      }
    };
  }, [src, type, autoPlay]);

  return (
    <video
      ref={videoRef}
      controls={controls}
      onPlay={autoPlay ? undefined : handlePlay}
      {...rest}
    />
  );
};

export default VideoPlayer;
