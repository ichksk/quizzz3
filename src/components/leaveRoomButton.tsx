"use client";

import { leaveRoom } from "@/server/actions";
import { useRouter } from "next/navigation";

export const LeaveRoomButton = () => {
  const router = useRouter()

  return (
    <button
      onClick={() => {
        leaveRoom()
          .then(() => {
            router.push("/")
          })
      }}
      className="mt-12 px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors duration-200"
    >
      退出する
    </button>
  )
}