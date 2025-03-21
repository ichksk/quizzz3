
import { Room } from "@/types/schemas"
import { FinishedPage } from "./finishedPage"
import { WaitingPage } from "./waitingPage"
import { PlayingPage } from "./playigPage"
import { useAtomValue } from "jotai"
import { roomAtom } from "@/lib/atoms"

export function ParticipantPage() {
  const room = useAtomValue(roomAtom) as Room

  switch (room.status) {
    case "WAITING":
      return <WaitingPage />
    case "IN_PROGRESS":
      return <PlayingPage />
    case "FINISHED":
      return <FinishedPage />
  }
}