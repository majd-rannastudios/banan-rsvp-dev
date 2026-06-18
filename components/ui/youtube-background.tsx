"use client";

import { useEffect, useId, useRef } from "react";

declare global {
  interface Window {
    YT?: {
      Player: new (el: HTMLElement | string, config: Record<string, unknown>) => YTPlayer;
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}

interface YTPlayer {
  seekTo: (seconds: number, allowSeekAhead: boolean) => void;
  getCurrentTime: () => number;
  destroy: () => void;
}

/**
 * Loops a specific clip of a YouTube video as a muted, chrome-free hero
 * background.
 *
 * The <iframe> is rendered directly with autoplay baked into its src, so
 * playback starts the moment the iframe paints - it does NOT wait for the
 * IFrame JS API script to load first. The JS API is attached afterward,
 * purely to seek back to `startSeconds` once playback nears `endSeconds`
 * (the native start/end embed params only stop there, they don't loop).
 *
 * Sized with the standard "oversize + crop" technique rather than
 * object-fit: object-fit on an iframe only affects the iframe's own box,
 * not the cross-origin video YouTube renders inside it - YouTube always
 * letterboxes to preserve aspect ratio instead of cropping, so without
 * this the clip shows pillarboxed/"landscape" on portrait screens.
 */
export function YouTubeBackground({
  videoId,
  startSeconds,
  endSeconds,
}: {
  videoId: string;
  startSeconds: number;
  endSeconds: number;
}) {
  const iframeId = useId().replace(/[^a-zA-Z0-9]/g, "");
  const playerRef = useRef<YTPlayer | null>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    let pollId: ReturnType<typeof setInterval> | undefined;
    let cancelled = false;

    function attachController() {
      if (cancelled || !window.YT) return;
      playerRef.current = new window.YT.Player(iframeId, {
        events: {
          onReady: () => {
            pollId = setInterval(() => {
              const player = playerRef.current;
              if (!player) return;
              if (player.getCurrentTime() >= endSeconds - 0.4) {
                player.seekTo(startSeconds, true);
              }
            }, 500);
          },
        },
      });
    }

    if (window.YT?.Player) {
      attachController();
    } else {
      const existing = document.getElementById("youtube-iframe-api");
      if (!existing) {
        const script = document.createElement("script");
        script.id = "youtube-iframe-api";
        script.src = "https://www.youtube.com/iframe_api";
        document.head.appendChild(script);
      }
      const prev = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        prev?.();
        attachController();
      };
    }

    return () => {
      cancelled = true;
      if (pollId) clearInterval(pollId);
      playerRef.current?.destroy();
      playerRef.current = null;
    };
  }, [iframeId, startSeconds, endSeconds]);

  const src =
    `https://www.youtube.com/embed/${videoId}` +
    `?start=${startSeconds}&end=${endSeconds}&autoplay=1&mute=1&controls=0` +
    `&disablekb=1&modestbranding=1&rel=0&fs=0&playsinline=1&enablejsapi=1`;

  return (
    <div className="absolute inset-0 overflow-hidden">
      <link rel="preconnect" href="https://www.youtube.com" />
      <iframe
        id={iframeId}
        src={src}
        title=""
        allow="autoplay; encrypted-media"
        className="absolute top-1/2 left-1/2 h-[56.25vw] w-screen min-h-full min-w-[177.78vh] -translate-x-1/2 -translate-y-1/2 border-0"
      />
    </div>
  );
}
