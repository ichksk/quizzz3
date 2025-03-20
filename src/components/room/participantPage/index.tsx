
import { FinishedPage } from "./finishedPage"
// import PlayingPage from "./PlayingPage"
import { WaitingPage } from "./waitingPage"
import { getRoomData } from "@/server/actions"

export async function ParticipantPage() {
  const { room } = await getRoomData()

  if (!room) {
    return null
  }

  switch (room.status) {
    case "WAITING":
      return <WaitingPage room={room} />
    case "IN_PROGRESS":
      return null
    case "FINISHED":
      return <FinishedPage />
  }
}