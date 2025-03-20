import { OwnerPage } from "@/components/ownerPage";
import { ParticipantPage } from "@/components/participantPage";
import { getParticipant, getRoomData } from "@/server/actions";
import { notFound } from "next/navigation";

export default async function RoomPage() {
  const { participant } = await getParticipant()

  const { room } = await getRoomData()

  if (!participant || !room) {
    notFound()
  }

  return (
    <div>
      {participant.isOwner ? <OwnerPage /> : <ParticipantPage />}
    </div>
  )
}
