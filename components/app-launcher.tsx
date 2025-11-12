"use client";

import { useRef } from "react";
import type { ChannelInfo } from "@/types";

interface AppLauncherProps {
  isPomodoroVisible: boolean;
  isTodoVisible: boolean;
  togglePomodoroPanel: () => void;
  toggleTodoPanel: () => void;
  channelsList: ChannelInfo[];
  onChangeChannel: (videoId: string) => void;
}

export default function AppLauncher({
  isPomodoroVisible,
  isTodoVisible,
  togglePomodoroPanel,
  toggleTodoPanel,
  channelsList,
  onChangeChannel,
}: AppLauncherProps) {
  const nodeRef = useRef(null);

  // Function to handle random channel selection
  const handleRandomChannel = () => {
    if (channelsList && channelsList.length > 0) {
      const randomIndex = Math.floor(Math.random() * channelsList.length);
      const randomChannel = channelsList[randomIndex];
      onChangeChannel(randomChannel.id);
    }
  };

  return (
  <div className="flex items-center justify-center gap-6 px-6 py-4 bg-black/35 rounded-xl w-[366px] h-[57px]">
  
  {/* Button 5 */}
  <button className="w-6 h-6 flex items-center justify-center">
    <img src="/BMC.png" alt="Buy me a Coffee" className="w-6 h-6" />
  </button>

  {/* Separator */}
  <div className="w-px h-6 bg-white/70" />
  
  {/* Button 4 */}
  <button className="w-6 h-6 flex items-center justify-center">
    <img src="/store.png" alt="Merch Store" className="w-6 h-6" />
  </button>

  {/* Separator */}
  <div className="w-px h-6 bg-white/70" />

  {/* Button 3 */}
  <button className="w-6 h-6 flex items-center justify-center" onClick={handleRandomChannel}>
    <img src="/random.png" alt="Shuffle" className="w-6 h-6" />
  </button>

  {/* Separator */}
  <div className="w-px h-6 bg-white/70" />

  {/* Button 2 */}
  <button className="w-6 h-6 flex items-center justify-center" onClick={toggleTodoPanel}>
    <img src="/todoicon.png" alt="Todo" className="w-6 h-6" />
  </button>

  {/* Separator */}
  <div className="w-px h-6 bg-white/70" />

  {/* Button 1 */}
  <button className="w-6 h-6 flex items-center justify-center" onClick={togglePomodoroPanel}>
    <img src="/timer.png" alt="Timer" className="w-6 h-6" />
  </button>
</div>
  );
}
