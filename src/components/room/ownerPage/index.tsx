import { LeaveRoomButton } from "@/components/leaveRoomButton"
import { Header } from "./header"
import { ParticipantsList } from "./participantsList"
import { QuizController } from "./quizController"
import { motion } from "framer-motion"

export const OwnerPage = () => {
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
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="flex flex-col container mx-auto py-8 px-4 space-y-6"
    >
      <motion.div variants={itemVariants}>
        <Header />
      </motion.div>

      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        <ParticipantsList />
        <motion.div
          className="lg:col-span-2"
          whileHover={{ scale: 1.01 }}
          transition={{ duration: 0.2 }}
        >
          <QuizController />
        </motion.div>
      </motion.div>

      <motion.div variants={itemVariants}>
        <LeaveRoomButton />
      </motion.div>
    </motion.div>
  )
}