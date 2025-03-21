
import { Participant, Room } from "@/types/schemas"
import { FinishedPage } from "./finishedPage"
// import PlayingPage from "./PlayingPage"
import { WaitingPage } from "./waitingPage"
import { PlayingPage } from "./playigPage"
import { useAtomValue } from "jotai"
import { roomAtom } from "@/lib/atoms"

export function ParticipantPage() {
  const room = useAtomValue(roomAtom) as Room

  switch (room.status) {
    case "WAITING":
      return <WaitingPage room={room} />
    case "IN_PROGRESS":
      return <PlayingPage room={room} />
    case "FINISHED":
      return <FinishedPage />
  }
}