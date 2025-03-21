"use client";

import { Share } from "lucide-react"
import { Room } from "@/types/schemas"
import toast from "react-hot-toast";
import { motion } from "framer-motion";

export const RoomCodeField = ({ room }: { room: Room }) => {
  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/join?r=${room?.roomCode}`;
    try {
      await navigator.share({
        url: shareUrl,
      });
    } catch (err: any) {
      // ユーザーがキャンセルした場合はエラー表示を行わない
      if (err.name !== 'AbortError') {
        toast.error("Chromeなどのブラウザで共有機能を利用できます。");
      }
    }
  };

  if (!room) return null;

  return (
    <motion.div
      className="flex flex-wrap items-center gap-2 sm:gap-3"
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-center gap-2">
        <motion.span
          className="inline-block w-3 h-3 bg-blue-500 rounded-full"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [1, 0.8, 1]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <span className="text-sm text-gray-500 font-medium">ルームコード:</span>
      </div>

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
          className="p-2 text-white bg-blue-500 hover:bg-blue-600 rounded-full shadow-sm transition-colors duration-200"
          aria-label="共有URLをコピー"
          whileTap={{ scale: 0.95 }}
        >
          <Share className="w-4 h-4" />
        </motion.button>
      </motion.div>
    </motion.div>
  )
}