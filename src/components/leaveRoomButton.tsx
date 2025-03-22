"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

import { leaveRoom } from "@/server/actions";
import toast from "react-hot-toast";

export const LeaveRoomButton = () => {
  const router = useRouter();

  const handleClick = async () => {
    const res = await leaveRoom();
    if (res.success) {
      router.push("/");
    } else {
      toast.error(res.error as string);
    }
  }

  return (
    <button
      onClick={handleClick}
      className="mt-12 px-8 py-3 rounded-xl font-semibold text-slate-700 bg-gradient-to-r from-blue-100 via-indigo-100 to-purple-100 hover:from-blue-200 hover:via-indigo-200 hover:to-purple-200 border border-slate-200 shadow-md flex items-center justify-center gap-2 transition-colors duration-300 cursor-pointer w-full"
    >
      <LogOut className="w-5 h-5 text-indigo-400" />
      <span>退出する</span>
    </button>
  );
};