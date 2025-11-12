// "use client";
// import { useState, useEffect, useCallback } from "react";
// import React from "react";

// import Image from "next/image";
// import { X } from "lucide-react";
// import type { ChannelInfo } from "@/types";
// import { toggleFavorite, getFavoriteChannels } from "@/data/channels";

// interface ChannelSheetProps {
//   isOpen: boolean;
//   onClose: () => void;
//   currentChannel: string;
//   onChangeChannel: (videoId: string) => void;
//   channelsList: ChannelInfo[];
// }

// // Animated Heart Component
// interface AnimatedHeartProps {
//   isFavorited: boolean;
//   onClick: (e: React.MouseEvent) => void;
//   className?: string;
// }

// function AnimatedHeart({
//   isFavorited,
//   onClick,
//   className = "",
// }: AnimatedHeartProps) {
//   return (
//     <div
//       className={`relative w-4 h-4 transition-all duration-300 cursor-pointer ${className}`}
//       onClick={onClick}
//       title="Like"
//     >
//       <input
//         type="checkbox"
//         checked={isFavorited}
//         readOnly
//         className="absolute w-full h-full opacity-0 z-20 cursor-pointer"
//       />
//       <div className="w-full h-full flex justify-center items-center">
//         {/* Outline Heart */}
//         <svg
//           viewBox="0 0 24 24"
//           className={`absolute w-4 h-4 transition-opacity ${
//             isFavorited ? "opacity-0 fill-red-500" : "opacity-100 fill-gray-400"
//           }`}
//           xmlns="http://www.w3.org/2000/svg"
//         >
//           <path d="M17.5,1.917a6.4,6.4,0,0,0-5.5,3.3,6.4,6.4,0,0,0-5.5-3.3A6.8,6.8,0,0,0,0,8.967c0,4.547,4.786,9.513,8.8,12.88a4.974,4.974,0,0,0,6.4,0C19.214,18.48,24,13.514,24,8.967A6.8,6.8,0,0,0,17.5,1.917Zm-3.585,18.4a2.973,2.973,0,0,1-3.83,0C4.947,16.006,2,11.87,2,8.967a4.8,4.8,0,0,1,4.5-5.05A4.8,4.8,0,0,1,11,8.967a1,1,0,0,0,2,0,4.8,4.8,0,0,1,4.5-5.05A4.8,4.8,0,0,1,22,8.967C22,11.87,19.053,16.006,13.915,20.313Z" />
//         </svg>

//         {/* Filled Heart */}
//         <svg
//           viewBox="0 0 24 24"
//           className={`absolute w-4 h-4 fill-pink-400 transition-all duration-1000 ${
//             isFavorited
//               ? "opacity-100 animate-[heartFill_1s_ease-out]"
//               : "opacity-0"
//           }`}
//           xmlns="http://www.w3.org/2000/svg"
//         >
//           <path d="M17.5,1.917a6.4,6.4,0,0,0-5.5,3.3,6.4,6.4,0,0,0-5.5-3.3A6.8,6.8,0,0,0,0,8.967c0,4.547,4.786,9.513,8.8,12.88a4.974,4.974,0,0,0,6.4,0C19.214,18.48,24,13.514,24,8.967A6.8,6.8,0,0,0,17.5,1.917Z" />
//         </svg>

//         {/* Celebration Effect */}
//         <svg
//           className={`absolute w-6 h-6 stroke-red-500 fill-red-500 stroke-2 transition-all duration-500 ${
//             isFavorited
//               ? "opacity-100 animate-[heartCelebrate_0.5s_ease-out_forwards]"
//               : "opacity-0"
//           }`}
//           width="24"
//           height="24"
//           xmlns="http://www.w3.org/2000/svg"
//         >
//           <polygon points="3,3 6,6" />
//           <polygon points="3,12 6,12" />
//           <polygon points="6,19 9,16" />
//           <polygon points="21,3 18,6" />
//           <polygon points="21,12 18,12" />
//           <polygon points="18,19 15,16" />
//         </svg>
//       </div>

//       <style jsx>{`
//         @keyframes heartFill {
//           0% {
//             transform: scale(0);
//           }
//           25% {
//             transform: scale(1.2);
//           }
//           50% {
//             transform: scale(1);
//             filter: brightness(1.5);
//           }
//           100% {
//             transform: scale(1);
//           }
//         }

//         @keyframes heartCelebrate {
//           0% {
//             transform: scale(0);
//           }
//           50% {
//             opacity: 1;
//             filter: brightness(1.5);
//           }
//           100% {
//             transform: scale(1.4);
//             opacity: 0;
//           }
//         }
//       `}</style>
//     </div>
//   );
// }

// export default function ChannelSheet({
//   isOpen,
//   onClose,
//   currentChannel,
//   onChangeChannel,
//   channelsList,
// }: ChannelSheetProps) {
//   const [activeTab, setActiveTab] = useState<"all" | "favorites">("all");
//   const [favorites, setFavorites] = useState<string[]>([]);

//   // Function to refresh favorites from storage
//   const refreshFavorites = useCallback(() => {
//     const favs = getFavoriteChannels();
//     const favIds = favs.map((f) => f.id);
//     setFavorites(favIds);
//   }, []);

//   // Load favorites when component mounts or sheet opens
//   useEffect(() => {
//     if (isOpen) {
//       refreshFavorites();
//     }
//   }, [isOpen, refreshFavorites]);

//   // Also refresh when tab changes to favorites to ensure sync
//   useEffect(() => {
//     if (activeTab === "favorites") {
//       refreshFavorites();
//     }
//   }, [activeTab, refreshFavorites]);

//   const handleToggleFavorite = useCallback(
//     (channelId: string, e: React.MouseEvent) => {
//       e.stopPropagation();
//       e.preventDefault();

//       try {
//         const isFav = toggleFavorite(channelId);

//         // Immediately update local state based on the actual result
//         if (isFav) {
//           setFavorites((prev) => {
//             // Only add if not already present
//             return prev.includes(channelId) ? prev : [...prev, channelId];
//           });
//         } else {
//           setFavorites((prev) => prev.filter((id) => id !== channelId));
//         }

//         // Also refresh from storage to ensure consistency
//         setTimeout(() => {
//           refreshFavorites();
//         }, 100);
//       } catch (error) {
//         console.error("Error toggling favorite:", error);
//         // Fallback: refresh from storage
//         refreshFavorites();
//       }
//     },
//     [refreshFavorites]
//   );

//   // Get displayed channels - ensure favorites tab only shows truly favorited channels
//   const displayedChannels = React.useMemo(() => {
//     if (activeTab === "favorites") {
//       // Double-check against stored favorites to ensure accuracy
//       const storedFavorites = getFavoriteChannels().map((f) => f.id);
//       return channelsList.filter(
//         (channel) =>
//           favorites.includes(channel.id) && storedFavorites.includes(channel.id)
//       );
//     }
//     return channelsList;
//   }, [activeTab, channelsList, favorites]);

//   return (
//     <>
//       {/* Glassmorphism Backdrop Overlay */}
//       <div
//         className={`fixed inset-0 z-[99998] transition-all duration-300 ease-in-out ${
//           isOpen
//             ? "opacity-100 backdrop-blur-md bg-black/20"
//             : "opacity-0 pointer-events-none"
//         }`}
//         onClick={onClose}
//         style={{
//           backdropFilter: isOpen ? "blur(8px) saturate(180%)" : "none",
//           WebkitBackdropFilter: isOpen ? "blur(8px) saturate(180%)" : "none",
//         }}
//       />

//       {/* Channel Sheet */}
//       <div
//         className={`fixed inset-x-0 bottom-0 z-[99999] transform transition-transform duration-300 ease-in-out ${
//           isOpen ? "translate-y-0" : "translate-y-full"
//         }`}
//       >
//         <div className="bg-[#1a1a2e]/95 backdrop-blur-lg border-t border-purple-500/20 rounded-t-2xl shadow-2xl max-h-[80vh] relative">
//           {/* Enhanced glassmorphism effect for the sheet itself */}
//           <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a2e]/80 to-[#1a1a2e]/60 backdrop-blur-xl rounded-t-2xl" />
//           <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-pink-500/10 rounded-t-2xl" />

//           {/* Content */}
//           <div className="relative z-10">
//             <div className="flex items-center justify-between p-4 border-b border-purple-500/20">
//               <h2 className="text-lg font-medium text-white">Lofi Channels</h2>
//               <div className="flex items-center gap-4">
//                 <div className="flex rounded-xl overflow-hidden border border-purple-500/30 bg-white/5 backdrop-blur-sm">
//                   <button
//                     onClick={() => setActiveTab("all")}
//                     className={`px-4 py-1.5 text-sm rounded-l-xl transition-all duration-200 ${
//                       activeTab === "all"
//                         ? "bg-gradient-to-r from-[#E88880] to-purple-500 text-white shadow-lg backdrop-blur-sm"
//                         : "bg-white/10 text-gray-300 hover:bg-white/20"
//                     }`}
//                   >
//                     All
//                   </button>
//                   <button
//                     onClick={() => setActiveTab("favorites")}
//                     className={`px-4 py-1.5 text-sm rounded-r-xl transition-all duration-200 ${
//                       activeTab === "favorites"
//                         ? "bg-gradient-to-r from-[#E88880] to-purple-500 text-white shadow-lg backdrop-blur-sm"
//                         : "bg-white/10 text-gray-300 hover:bg-white/20"
//                     }`}
//                   >
//                     Favorites
//                   </button>
//                 </div>
//                 <button
//                   onClick={onClose}
//                   className="rounded-full p-1 hover:bg-white/20 transition-all duration-200 backdrop-blur-sm"
//                   aria-label="Close menu"
//                 >
//                   <X className="h-6 w-6 text-white" />
//                 </button>
//               </div>
//             </div>

//             <div className="channel-sheet-content overflow-y-auto max-h-[60vh] p-4">
//               <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
//                 {displayedChannels.length === 0 && activeTab === "favorites" ? (
//                   <div className="col-span-full text-center py-8 text-gray-300">
//                     <p>No favorite channels yet</p>
//                     <p className="text-sm mt-2 opacity-70">
//                       Click the heart icon on any channel to add it to favorites
//                     </p>
//                   </div>
//                 ) : (
//                   displayedChannels.map((channel) => (
//                     <div
//                       key={channel.id}
//                       className={`relative flex flex-col items-center justify-center p-3 rounded-xl transition-all duration-200 backdrop-blur-sm ${
//                         currentChannel === channel.id
//                           ? "bg-purple-500/30 border border-purple-500/50 shadow-lg shadow-purple-500/20"
//                           : "bg-white/10 border border-white/20 hover:bg-white/20 hover:border-white/30 hover:shadow-lg hover:shadow-white/10"
//                       }`}
//                     >
//                       <button
//                         onClick={() => {
//                           onChangeChannel(channel.id);
//                           onClose();
//                         }}
//                         className="w-full h-full flex flex-col items-center"
//                         title={channel.title}
//                       >
//                         <div className="w-12 h-12 flex items-center justify-center mb-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/10">
//                           <Image
//                             width={24}
//                             height={24}
//                             src={channel.icon || "/placeholder.svg"}
//                             alt={channel.title}
//                           />
//                         </div>
//                         <span className="text-xs text-center text-white truncate w-full">
//                           {channel.title}
//                         </span>
//                       </button>

//                       {/* Animated heart with improved state handling */}
//                       <div className="absolute top-1 right-1 p-1 rounded-full hover:bg-white/20 backdrop-blur-sm transition-all duration-200">
//                         <AnimatedHeart
//                           isFavorited={favorites.includes(channel.id)}
//                           onClick={(e) => handleToggleFavorite(channel.id, e)}
//                         />
//                       </div>
//                     </div>
//                   ))
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }







"use client";
import { useState, useEffect, useCallback } from "react";
import React from "react";
import { X, Moon, Sun } from "lucide-react";
import type { ChannelInfo } from "@/types";
import { toggleFavorite, getFavoriteChannels } from "@/data/channels";

// Heart Icon Toggle
function HeartIcon({
  isFavorited,
  onClick,
}: {
  isFavorited: boolean;
  onClick: (e: React.MouseEvent) => void;
}) {
  return (
    <button
      onClick={onClick}
      className="transition-colors duration-200"
      title="Like"
    >
      {isFavorited ? (
        <svg
          className="w-5 h-5 fill-white"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 6 3.99 4 6.5 4c1.74 0 
          3.41 1.01 4.13 2.44h.74C13.09 5.01 14.76 4 16.5 
          4 19.01 4 21 6 21 8.5c0 3.78-3.4 6.86-8.55 
          11.54L12 21.35z" />
        </svg>
      ) : (
        <svg
          className="w-5 h-5 stroke-gray-400 hover:stroke-white"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 
          2 6 3.99 4 6.5 4c1.74 0 3.41 1.01 
          4.13 2.44h.74C13.09 5.01 14.76 4 
          16.5 4 19.01 4 21 6 21 8.5c0 
          3.78-3.4 6.86-8.55 11.54L12 
          21.35z" />
        </svg>
      )}
    </button>
  );
}

interface PlaylistSheetProps {
  isOpen: boolean;
  onClose: () => void;
  currentChannel: string;
  onChangeChannel: (videoId: string) => void;
  channelsList: ChannelInfo[];
}

export default function PlaylistSheet({
  isOpen,
  onClose,
  currentChannel,
  onChangeChannel,
  channelsList,
}: PlaylistSheetProps) {
  const [activeTab, setActiveTab] = useState<"all" | "favorites">("all");
  const [favorites, setFavorites] = useState<string[]>([]);

  const refreshFavorites = useCallback(() => {
    const favs = getFavoriteChannels();
    const favIds = favs.map((f) => f.id);
    setFavorites(favIds);
  }, []);

  useEffect(() => {
    if (isOpen) refreshFavorites();
  }, [isOpen, refreshFavorites]);

  useEffect(() => {
    if (activeTab === "favorites") refreshFavorites();
  }, [activeTab, refreshFavorites]);

  const handleToggleFavorite = useCallback(
    (channelId: string, e: React.MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();
      try {
        const isFav = toggleFavorite(channelId);
        if (isFav) {
          setFavorites((prev) =>
            prev.includes(channelId) ? prev : [...prev, channelId]
          );
        } else {
          setFavorites((prev) => prev.filter((id) => id !== channelId));
        }
      } catch (error) {
        console.error("Error toggling favorite:", error);
        refreshFavorites();
      }
    },
    [refreshFavorites]
  );

  const displayedChannels = React.useMemo(() => {
    if (activeTab === "favorites") {
      const storedFavorites = getFavoriteChannels().map((f) => f.id);
      return channelsList.filter(
        (c) => favorites.includes(c.id) && storedFavorites.includes(c.id)
      );
    }
    return channelsList;
  }, [activeTab, channelsList, favorites]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[99998] transition-all duration-300 ease-in-out ${
          isOpen
            ? "opacity-100  bg-black/20"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Playlist Card */}
      <div
        className={`fixed bottom-0 right-0 w-full sm:w-[690px] max-h-[80vh] rounded-2xl z-[99999] transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0 pointer-events-none"
        } bg-black-20 backdrop-blur-xl shadow-2xl flex flex-col`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-white/10">
          <h2 className="text-lg font-semibold text-white">Playlist</h2>
          <button
            onClick={onClose}
            className="rounded-full p-1 hover:bg-white/20 transition"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex space-x-3 px-5 py-2 border-b border-white/10">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-3 py-1 rounded-full text-sm ${
              activeTab === "all"
                ? "bg-white/20 text-white"
                : "text-gray-300 hover:bg-white/10"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setActiveTab("favorites")}
            className={`px-3 py-1 rounded-full text-sm ${
              activeTab === "favorites"
                ? "bg-white/20 text-white"
                : "text-gray-300 hover:bg-white/10"
            }`}
          >
            Favorite
          </button>
        </div>

        {/* Songs Grid */}
        <div className="grid grid-cols-2 gap-3 p-2 overflow-y-auto">
          {displayedChannels.length === 0 && activeTab === "favorites" ? (
            <div className="col-span-2 text-center text-gray-400 py-12">
              <p>No favorite tracks yet</p>
              <p className="text-sm mt-2 opacity-70">Tap the heart to add tracks</p>
            </div>
          ) : (
            displayedChannels.map((channel) => (
              <div
                key={channel.id}
                className={`flex items-center justify-between rounded-xl bg-white/5 p-3 hover:bg-white/10 transition cursor-pointer ${
                  currentChannel === channel.id
                    ? "ring-1 ring-white/50 shadow-lg"
                    : ""
                }`}
                onClick={() => {
                  onChangeChannel(channel.id);
                  onClose();
                }}
              >
                <div className="flex items-center space-x-3">
                  <div className="bg-white/10 p-2 rounded-full">
                    {/* Example: Moon/Sun icons */}
                    {channel.id.includes("night") ? (
                      <Moon className="w-4 h-4 text-white" />
                    ) : (
                      <Sun className="w-4 h-4 text-white" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white truncate">
                      {channel.title}
                    </h3>
                    {currentChannel === channel.id && (
                      <p className="text-xs text-pink-400">Now Playing</p>
                    )}
                  </div>
                </div>
                <HeartIcon
                  isFavorited={favorites.includes(channel.id)}
                  onClick={(e) => handleToggleFavorite(channel.id, e)}
                />
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
