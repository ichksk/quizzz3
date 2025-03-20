"use client";

import { OwnerPage } from "@/components/room/ownerPage";
import { ParticipantPage } from "@/components/room/participantPage";
import { getParticipant, getRoomData } from "@/server/actions";
import { Participant, RoomForOwner, RoomForParticipant } from "@/types/schemas";
import { notFound } from "next/navigation";
import { useEffect, useState } from "react";

export default function RoomPage() {
  const [room, setRoom] = useState<RoomForOwner | RoomForParticipant | null>(null)
  const [participant, setParticipant] = useState<Participant | null>(null)

  useEffect(() => {
    const fetchRoomData = async () => {
      const { room } = await getRoomData()
      const { participant } = await getParticipant()
      if (!room || !participant) {
        notFound()
      } else {
        setRoom(room)
        setParticipant(participant)
      }
    }

    fetchRoomData()
  }, [])

  if (!participant || !room) return null

  return participant.isOwner ? (
    <OwnerPage
      room={room as RoomForOwner}
      participant={participant} />
  ) : (
    <ParticipantPage
      room={room as RoomForParticipant}
      participant={participant} />
  )
}
