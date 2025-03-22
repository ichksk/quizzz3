import { useAtomValue } from "jotai"
import { AnimatePresence, motion } from "framer-motion"
import { useEffect, useState } from "react"
import { ChatRoom } from "../chatRoom"
import { FinishedPage } from "./finishedPage"
import { WaitingPage } from "./waitingPage"
import { PlayingPage } from "./playigPage"
import { roomAtom } from "@/lib/atoms"
import { Room } from "@/types/schemas"

export function ParticipantPage() {
  const room = useAtomValue(roomAtom) as Room
  const [prevStatus, setPrevStatus] = useState(room.status)

  // Track status changes for transition animations
  useEffect(() => {
    setPrevStatus(room.status)
  }, [room.status])

  const getPageComponent = () => {
    switch (room.status) {
      case "WAITING":
        return <WaitingPage />
      case "IN_PROGRESS":
        return <PlayingPage />
      case "FINISHED":
        return <FinishedPage />
    }
  }

  // Determine transition direction based on status change
  const getDirection = () => {
    const statusOrder = ["WAITING", "IN_PROGRESS", "FINISHED"]
    const prevIndex = statusOrder.indexOf(prevStatus)
    const currentIndex = statusOrder.indexOf(room.status)
    return currentIndex > prevIndex ? 1 : -1 // 1 for forward, -1 for backward
  }

  const direction = getDirection()
  const pageVariants = {
    enter: {
      x: direction * 50,
      opacity: 0
    },
    center: {
      x: 0,
      opacity: 1
    },
    exit: {
      x: direction * -50,
      opacity: 0
    }
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={room.status}
        initial="enter"
        animate="center"
        exit="exit"
        variants={pageVariants}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30
        }}
        className="w-full h-full"
      >
        {getPageComponent()}
        <ChatRoom />
      </motion.div>
    </AnimatePresence>
  )
}