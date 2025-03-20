import CustomNotFound from "@/components/CustomNotFound";
import { LeaveRoomButton } from "@/components/leaveRoomButton";
import { OwnerPage } from "@/components/ownerPage";
import { ParticipantPage } from "@/components/participantPage";
import { getParticipant, getRoomData } from "@/server/actions";

export default async function RoomPage() {
  const { participant } = await getParticipant()

  const roomData = await getRoomData()

  console.log(participant)
  if (!participant || !roomData.room) {
    return <CustomNotFound />
  }

  console.log(roomData)

  return (
    <div>
      {participant.isOwner ? <OwnerPage /> : <ParticipantPage />}
    </div>
  )
}
