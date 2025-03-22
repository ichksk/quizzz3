import { AnimatePresence, motion } from "framer-motion"
import { useAtomValue } from "jotai"
import { useEffect, useState } from "react"

import { roomAtom } from "@/lib/atoms"
import { Room } from "@/types/schemas"

import { FinishedPage } from "./finishedPage"
import { PlayingPage } from "./playigPage"
import { WaitingPage } from "./waitingPage"

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

  const confettiColors = ['#FFD700', '#FF6B6B', '#4CC2FF', '#9F44D3', '#F7CAC9'];

  return (
    <AnimatePresence mode="wait">
      {room.status === "FINISHED" && Array.from({ length: 30 }).map((_, i) => (
        <motion.div
          key={i}
          className="fixed w-4 h-4 rounded-full"
          style={{
            backgroundColor: confettiColors[i % confettiColors.length],
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`
          }}
          animate={{
            y: [0, Math.random() * 100 + 50],
            x: [0, (Math.random() - 0.5) * 100],
            opacity: [1, 0]
          }}
          transition={{
            duration: Math.random() * 2 + 3,
            ease: "easeOut",
            repeat: Infinity,
            delay: Math.random() * 2
          }}
        />
      ))}
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
      </motion.div>
    </AnimatePresence>
  )
}