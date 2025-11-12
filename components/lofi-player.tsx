"use client";

import { useEffect, useRef } from "react";
import Script from "next/script";

interface LofiPlayerProps {
  currentChannel: string;
  setPlayer: (player: any) => void;
  isPlaying: boolean;
  isRepeat: boolean; // 🆕 new prop for repeat mode
  onNext: () => void; // 🆕 for next song when repeat is off
}

export default function LofiPlayer({
  currentChannel,
  setPlayer,
  isPlaying,
  isRepeat,
  onNext,
}: LofiPlayerProps) {
  const playerRef = useRef<HTMLDivElement>(null);
  const youtubeApiLoaded = useRef(false);
  const playerInstance = useRef<any>(null);

  useEffect(() => {
    window.onYouTubeIframeAPIReady = () => {
      youtubeApiLoaded.current = true;
      initializePlayer();
    };

    if (window.YT && youtubeApiLoaded.current) {
      initializePlayer();
    }
  }, []);

  useEffect(() => {
    if (playerInstance.current) {
      if (isPlaying) {
        playerInstance.current.playVideo();
      } else {
        playerInstance.current.pauseVideo();
      }
    }
  }, [isPlaying]);

  useEffect(() => {
    // When channel changes, load new video
    if (playerInstance.current && currentChannel) {
      playerInstance.current.loadVideoById(currentChannel);
    }
  }, [currentChannel]);

  const initializePlayer = () => {
    if (!playerRef.current) return;

    const player = new window.YT.Player(playerRef.current, {
      height: "100%",
      width: "100%",
      videoId: currentChannel,
      playerVars: {
        playsinline: 1,
        autoplay: 1,
        mute: 1,
        controls: 0,
        showinfo: 0,
        rel: 0,
        iv_load_policy: 3,
        fs: 0,
        modestbranding: 1,
        disablekb: 1,
        cc_load_policy: 0,
        origin: window.location.origin,
      },
      events: {
        onReady: (event: any) => {
          event.target.playVideo();
          setTimeout(() => {
            event.target.unMute();
            event.target.setVolume(70);
          }, 1000);

          setPlayer(event.target);
          playerInstance.current = event.target;
        },

        // 🎧 Handle video end
        onStateChange: (event: any) => {
          if (event.data === window.YT.PlayerState.ENDED) {
            if (isRepeat) {
              // 🔁 Replay same song
              event.target.seekTo(0);
              event.target.playVideo();
            } else {
              // ⏭️ Go to next song
              onNext();
            }
          }
        },
      },
    });
  };

  return (
    <>
      <Script src="https://www.youtube.com/iframe_api" strategy="afterInteractive" />
      <div
        id="lofi-player"
        ref={playerRef}
        className="fixed inset-0 w-full h-full pointer-events-none"
      ></div>
    </>
  );
}








