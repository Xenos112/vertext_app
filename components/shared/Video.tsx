"use client";
import { useRef, useEffect, VideoHTMLAttributes } from "react";
import Hls from "hls.js";
import * as dashjs from "dashjs";

type VideoFormat = "mp4" | "hls" | "dash";

interface VideoPlayerProps extends React.VideoHTMLAttributes<HTMLVideoElement> {
  src: string;
  type: VideoFormat;
  autoPlay?: boolean;
  controls?: boolean;
  videoProps: VideoHTMLAttributes<HTMLVideoElement>;
}

const VideoPlayer = ({
  src,
  type = "mp4",
  autoPlay = false,
  controls = true,
  ...videoProps
}: VideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const dashPlayerRef = useRef<dashjs.MediaPlayerClass | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !src) return;

    const initializePlayer = async () => {
      try {
        if (type === "hls") {
          if (video.canPlayType("application/vnd.apple.mpegurl")) {
            video.src = src;
            if (autoPlay) video.play();
            return;
          }

          const Hls = (await import("hls.js")).default;
          if (Hls.isSupported()) {
            hlsRef.current = new Hls();
            hlsRef.current.loadSource(src);
            hlsRef.current.attachMedia(video);
            hlsRef.current.on(Hls.Events.MANIFEST_PARSED, () => {
              if (autoPlay) video.play();
            });
          }
        } else if (type === "dash") {
          const dashjs = await import("dashjs");
          dashPlayerRef.current = dashjs.MediaPlayer().create();
          dashPlayerRef.current.initialize(video, src, autoPlay);
        } else {
          video.src = src;
          video.addEventListener("loadedmetadata", () => {
            if (autoPlay) video.play();
          });
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
    };
  }, [src, type, autoPlay]);

  return <video ref={videoRef} controls={controls} {...videoProps} />;
};

export default VideoPlayer;
