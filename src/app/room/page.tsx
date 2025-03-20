import { LeaveRoomButton } from "@/components/leaveRoomButton";
import { getParticipant } from "@/server/actions";
import { getCookie } from "@/server/cookies";

export default async function RoomPage() {
  const { participant } = await getParticipant()

  return (
    <div>
      <h1>Room</h1>
      <p>Participant: {participant?.username
        ? `${participant.username} (${participant.id})`
        : "Not found"}</p>
      <LeaveRoomButton />
    </div>
  )
}