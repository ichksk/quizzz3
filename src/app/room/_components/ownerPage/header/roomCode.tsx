"use client";

import { motion } from "framer-motion";
import { Share } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

import { Room } from "@/types/schemas";

export const RoomCodeField = ({
  room,
  onRoomNameChange,
}: {
  room: Room;
  onRoomNameChange?: (name: string) => void;
}) => {
  const [roomName, setRoomName] = useState(room.roomName || "");

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/join?r=${room?.roomCode}`;
    try {
      await navigator.share({
        url: shareUrl,
      });
    } catch (err: unknown) {
      if (err instanceof Error) {
        if (err.name !== "AbortError") {
          toast.error("Chromeなどのブラウザで共有機能を利用できます。");
        }
      }
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setRoomName(newName);
    onRoomNameChange?.(newName);
  };

  if (!room) return null;

  return (
    <motion.div
      className="flex flex-wrap items-center gap-2 sm:gap-3"
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <motion.span
        className="text-lg text-blue-500 font-bold bg-clip-text mr-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {room.roomCode}
      </motion.span>
      <motion.div
        className="flex items-center ml-auto sm:ml-0"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <motion.button
          onClick={handleShare}
          className="p-2 text-white bg-blue-500 hover:bg-blue-600 rounded-full shadow-sm transition-colors duration-200 cursor-pointer"
          aria-label="共有URLをコピー"
          whileTap={{ scale: 0.95 }}
        >
          <Share className="w-4 h-4" />
        </motion.button>
      </motion.div>
    </motion.div>
  );
};
