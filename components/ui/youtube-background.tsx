"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    YT?: {
      Player: new (el: HTMLElement, config: Record<string, unknown>) => YTPlayer;
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}

interface YTPlayer {
  mute: () => void;
  playVideo: () => void;
  seekTo: (seconds: number, allowSeekAhead: boolean) => void;
  getCurrentTime: () => number;
  destroy: () => void;
}

/**
 * Loops a specific clip of a YouTube video as a muted, chrome-free hero
 * background. The native `start`/`end` embed params only stop playback at
 * `end` (they don't loop back to `start`), so a small poll re-seeks once
 * the clip nears its end - the IFrame API has no "loop within range" event
 * to hook instead.
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
  const hostRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YTPlayer | null>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    let pollId: ReturnType<typeof setInterval> | undefined;
    let cancelled = false;

    function createPlayer() {
      if (cancelled || !hostRef.current || !window.YT) return;
      playerRef.current = new window.YT.Player(hostRef.current, {
        videoId,
        playerVars: {
          start: startSeconds,
          end: endSeconds,
          autoplay: 1,
          mute: 1,
          controls: 0,
          disablekb: 1,
          modestbranding: 1,
          rel: 0,
          fs: 0,
          playsinline: 1,
        },
        events: {
          onReady: (e: { target: YTPlayer }) => {
            e.target.mute();
            e.target.playVideo();
            pollId = setInterval(() => {
              const player = playerRef.current;
              if (!player) return;
              if (player.getCurrentTime() >= endSeconds - 0.4) {
                player.seekTo(startSeconds, true);
                player.playVideo();
              }
            }, 500);
          },
        },
      });
    }

    if (window.YT?.Player) {
      createPlayer();
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
        createPlayer();
      };
    }

    return () => {
      cancelled = true;
      if (pollId) clearInterval(pollId);
      playerRef.current?.destroy();
      playerRef.current = null;
    };
  }, [videoId, startSeconds, endSeconds]);

  return (
    <div className="absolute inset-0 overflow-hidden [&_iframe]:absolute [&_iframe]:inset-0 [&_iframe]:h-full [&_iframe]:w-full [&_iframe]:border-0 [&_iframe]:object-cover">
      <div ref={hostRef} />
    </div>
  );
}
