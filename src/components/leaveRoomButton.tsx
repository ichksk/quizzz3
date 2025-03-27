"use client";

import { LogOut } from "lucide-react";

import { useLeaveRoom } from "@/hooks/useLeaveRoom";

export const LeaveRoomButton = () => {
  const leaveRoom = useLeaveRoom();

  return (
    <button
      onClick={leaveRoom}
      className="mt-12 px-8 py-3 rounded-xl font-semibold text-slate-700 bg-gradient-to-r from-blue-100 via-indigo-100 to-purple-100 hover:from-blue-200 hover:via-indigo-200 hover:to-purple-200 border border-slate-200 shadow-md flex items-center justify-center gap-2 transition-colors duration-300 cursor-pointer w-full"
    >
      <LogOut className="w-5 h-5 text-indigo-400" />
      <span>退出する</span>
    </button>
  );
};