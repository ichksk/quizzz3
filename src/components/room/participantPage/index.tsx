
import { Participant, RoomForParticipant } from "@/types/schemas"
import { FinishedPage } from "./finishedPage"
// import PlayingPage from "./PlayingPage"
import { WaitingPage } from "./waitingPage"

export async function ParticipantPage({ room, participant }: { room: RoomForParticipant, participant: Participant }) {


  switch (room.status) {
    case "WAITING":
      return <WaitingPage room={room} />
    case "IN_PROGRESS":
      return null
    case "FINISHED":
      return <FinishedPage />
  }
}