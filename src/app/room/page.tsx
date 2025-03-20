import CustomNotFound from "@/components/CustomNotFound";
import { LeaveRoomButton } from "@/components/leaveRoomButton";
import { getParticipant, getRoomData } from "@/server/actions";
import { getCookie } from "@/server/cookies";

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
      <h1>Room: {roomData.room?.roomCode}</h1>
      <p>Participant: {participant?.username || "Not found"}</p>
      {participant.isOwner ? <OwnerPage /> : <ParticipantPage />}
      <LeaveRoomButton />
    </div>
  )
}


const OwnerPage = () => {
  return (
    <div>
      <h1>Owner</h1>
    </div>
  )
}

const ParticipantPage = () => {
  return (
    <div>
      <h1>Participant</h1>
    </div>
  )
}