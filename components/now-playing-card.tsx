"use client";

import { Play, Pause, SkipBack, SkipForward, Shuffle, Repeat } from "lucide-react";
import { useState, useCallback } from "react";
import type { ChannelInfo } from "@/types";

interface NowPlayingCardProps {
  currentChannel: string;
  channelsList: ChannelInfo[];
  isPlaying: boolean;
  onTogglePlay: () => void;
  onChangeChannel: (videoId: string) => void;
}

export default function NowPlayingCard({
  currentChannel,
  channelsList,
  isPlaying,
  onTogglePlay,
  onChangeChannel,
}: NowPlayingCardProps) {
  const [isRepeat, setIsRepeat] = useState(false);

  // Get current channel index
  const currentIndex = channelsList.findIndex((c) => c.id === currentChannel);

  // Get current channel title
  const getCurrentChannelTitle = () => {
    const channel = channelsList[currentIndex];
    return channel ? channel.title : "Unknown Channel";
  };

  // Shuffle: random channel
  const handleShuffle = useCallback(() => {
    if (!channelsList || channelsList.length === 0) return;
    let randomIndex = Math.floor(Math.random() * channelsList.length);
    // avoid same channel if possible
    if (randomIndex === currentIndex && channelsList.length > 1) {
      randomIndex = (randomIndex + 1) % channelsList.length;
    }
    onChangeChannel(channelsList[randomIndex].id);
  }, [channelsList, currentIndex, onChangeChannel]);

  // Previous: move one step back
  const handlePrev = useCallback(() => {
    if (!channelsList || channelsList.length === 0) return;
    const prevIndex = (currentIndex - 1 + channelsList.length) % channelsList.length;
    onChangeChannel(channelsList[prevIndex].id);
  }, [channelsList, currentIndex, onChangeChannel]);

  // Next: move one step forward
  const handleNext = useCallback(() => {
    if (!channelsList || channelsList.length === 0) return;
    const nextIndex = (currentIndex + 1) % channelsList.length;
    onChangeChannel(channelsList[nextIndex].id);
  }, [channelsList, currentIndex, onChangeChannel]);

  // Repeat toggle
  const toggleRepeat = () => setIsRepeat((prev) => !prev);

  return (
    <div
      id="now-playing-card"
      className="fixed bottom-5 left-5 flex flex-row justify-center items-center px-6 py-3 gap-6 
                 bg-black/35 rounded-xl backdrop-blur-md text-white 
                 shadow-xl z-[999] transition-transform duration-300 hover:scale-105 w-[256px] h-[57px]"
    >

      {/* Controls */}
      <div className="flex flex-row items-center gap-4">
        {/* Shuffle */}
        <button
          onClick={handleShuffle}
          className="flex justify-center items-center w-8 h-8 min-w-8 rounded-full hover:bg-white/20 transition"
          aria-label="Shuffle"
        >
          <Shuffle className="h-4 w-4 text-white" />
        </button>

        {/* Previous */}
        <button
          onClick={handlePrev}
          className="flex justify-center items-center w-8 h-8 min-w-8 rounded-full hover:bg-white/20 transition"
          aria-label="Previous"
        >
          <SkipBack className="h-4 w-4 text-white" />
        </button>

        {/* Play / Pause */}
        <button
          onClick={onTogglePlay}
          className="flex justify-center items-center w-8 h-8 min-w-8 rounded-full bg-white hover:bg-white/90 transition"
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? (
            <Pause className="h-4 w-4 text-black" />
          ) : (
            <Play className="h-4 w-4 text-black" />
          )}
        </button>

        {/* Next */}
        <button
          onClick={handleNext}
          className="flex justify-center items-center w-8 h-8 min-w-8 rounded-full hover:bg-white/20 transition"
          aria-label="Next"
        >
          <SkipForward className="h-4 w-4 text-white" />
        </button>

        {/* Repeat */}
        <button
  onClick={() => setIsRepeat((prev) => !prev)}
  className={`flex justify-center items-center w-8 h-8 min-w-8 rounded-full transition
    ${isRepeat ? "bg-white/20 text-yellow-400" : "hover:bg-white/20 text-white"}`}
  aria-label="Repeat"
>
  <Repeat className="h-4 w-4" />
</button>

      </div>
    </div>
  );
}