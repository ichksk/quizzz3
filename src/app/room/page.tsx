import { OwnerPage } from "@/components/room/ownerPage";
import { ParticipantPage } from "@/components/room/participantPage";
import { getParticipant, getRoomData } from "@/server/actions";
import { RoomForOwner, RoomForParticipant } from "@/types/schemas";
import { notFound } from "next/navigation";

export default async function RoomPage() {
  const { participant } = await getParticipant()

  const { room } = await getRoomData()

  if (!participant || !room) {
    notFound()
  }

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
