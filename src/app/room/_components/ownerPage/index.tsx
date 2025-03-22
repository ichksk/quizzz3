import { motion } from "framer-motion"
import { useAtomValue } from "jotai"

import { roomAtom } from "@/lib/atoms"
import { LeaveRoomButton } from "@/shared/leaveRoomButton"

import { Header } from "./header"
import { ParticipantsList } from "./participantsList"
import { QuizController } from "./quizController"


export const OwnerPage = () => {
  const room = useAtomValue(roomAtom);
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="relative space-y-4"
      >
        <motion.div variants={itemVariants}>
          <Header />
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 lg:grid-cols-3 gap-4"
        >
          <ParticipantsList />
          <QuizController />
        </motion.div>

        <motion.div variants={itemVariants}>
          <LeaveRoomButton />
        </motion.div>

        {/* {room?.status === "FINISHED" && <Donation variants={itemVariants} />} */}
      </motion.div>
    </div>
  )
}