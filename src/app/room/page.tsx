import { OwnerPage } from "@/components/ownerPage";
import { ParticipantPage } from "@/components/participantPage";
import { getParticipant, getRoomData } from "@/server/actions";
import { notFound } from "next/navigation";

export default async function RoomPage() {
  const { participant } = await getParticipant()

  const roomData = await getRoomData()

  if (!participant || !roomData.room) {
    notFound()
  }

  return (
    <div>
      {participant.isOwner ? <OwnerPage /> : <ParticipantPage />}
    </div>
  )
}
