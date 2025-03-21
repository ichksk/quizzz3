"use client";

import { Share } from "lucide-react"

import { Room } from "@/types/schemas"


export const RoomCodeField = ({ room }: { room: Room }) => {
  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/join?r=${room?.roomCode}`;
    try {
      await navigator.share({
        url: shareUrl,
      });
    } catch (error) {
      alert('URLのコピーに失敗しました' + error);
    }
  };

  if (!room) return null;

  return (
    <div className="flex items-center gap-2">
      <p className="text-lg font-bold">{room.roomCode}</p>
      <div className="flex items-center gap-1">
        <button
          onClick={handleShare}
          className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded"
          aria-label="共有URLをコピー"
        >
          <Share className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}