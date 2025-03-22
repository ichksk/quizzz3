"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

import { leaveRoom } from "@/server/actions";

export const LeaveRoomButton = () => {
  const router = useRouter();

  return (
    <button
      onClick={() => {
        leaveRoom()
          .then(() => {
            router.push("/");
          });
      }}
      className="mt-12 px-8 py-3 rounded-xl font-semibold text-slate-700 bg-gradient-to-r from-blue-100 via-indigo-100 to-purple-100 hover:from-blue-200 hover:via-indigo-200 hover:to-purple-200 border border-slate-200 shadow-md flex items-center justify-center gap-2 transition-colors duration-300 cursor-pointer"
    >
      <LogOut className="w-5 h-5 text-indigo-400" />
      <span>退出する</span>
    </button>
  );
};