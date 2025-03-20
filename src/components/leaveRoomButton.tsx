"use client";

// import { getCurrentParticipant } from "@/backend/getCurrent";
// import { Participant } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export const LeaveRoomButton = () => {
  // const [participant, setParticipant] = useState<Participant | null>(null)
  const router = useRouter()

  // useEffect(() => {
  //   // 初期データの取得
  //   getCurrentParticipant().then(setParticipant)
  // }, []);

  // const handleLeaveRoom = () => {
  //   if (participant) {
  //     leaveRoom(participant.id).then(() => {
  //       router.push('/')
  //     })
  //   }
  // }

  return (
    <button
      // onClick={handleLeaveRoom}
      className="mt-12 px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors duration-200"
    >
      退出する
    </button>
  )
}