"use client";

import { Users, Crown, Award } from "lucide-react";
import { useAtomValue } from "jotai";
import { motion } from "framer-motion";
import { Participant } from "@/types/schemas";
import { meAtom, participantsAtom } from "@/lib/atoms";

export function ParticipantsList() {
  const participants = useAtomValue(participantsAtom);
  const me = useAtomValue(meAtom) as Participant;

  const participantsExceptMe = participants.filter(
    (p) => p.id !== me.id
  );

  // Sort participants by score (highest first)
  const sortedParticipants = [...participantsExceptMe].sort((a, b) => b.score - a.score);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 120,
        damping: 10
      }
    }
  };

  return (
    <motion.div
      className="bg-white border border-gray-200 rounded-xl shadow-sm lg:col-span-1 overflow-hidden"
      whileHover={{ boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
      transition={{ duration: 0.3 }}
    >
      <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex items-center justify-between">
          <motion.h2
            className="text-lg font-semibold flex items-center gap-2 text-gray-800"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Users className="w-5 h-5 text-blue-500" />
            参加者一覧
          </motion.h2>

          <motion.span
            className="px-3 py-1 text-xs font-medium bg-blue-100 text-blue-600 rounded-full flex items-center gap-1"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <span>{participantsExceptMe.length}</span>
            <span>人参加中</span>
          </motion.span>
        </div>
      </div>

      <motion.div
        className="p-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {sortedParticipants.length > 0 ? (
          <div className="space-y-2">
            {sortedParticipants.map((participant, index) => (
              <motion.div
                key={participant.id}
                variants={itemVariants}
                whileHover={{
                  backgroundColor: index === 0 ? "rgba(253, 224, 71, 0.2)" : "rgba(243, 244, 246, 0.8)",
                  x: 3
                }}
                className={`flex items-center justify-between p-3 rounded-lg ${index === 0 && participant.score > 0 ? "bg-yellow-50 border border-yellow-100" : "hover:bg-gray-50"
                  }`}
              >
                <div className="flex items-center gap-2">
                  {index === 0 && participant.score > 0 ? (
                    <motion.div
                      animate={{
                        rotate: [0, 5, -5, 0],
                        scale: [1, 1.1, 1]
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        repeatType: "loop",
                        ease: "easeInOut",
                        repeatDelay: 2
                      }}
                    >
                      <Crown className="w-5 h-5 text-yellow-500" />
                    </motion.div>
                  ) : index === 1 && participant.score > 0 ? (
                    <Award className="w-4 h-4 text-gray-400" />
                  ) : null}

                  <span className="font-medium">{participant.username} さん</span>
                </div>

                <motion.span
                  className={`font-bold ${index === 0 && participant.score > 0 ? "text-yellow-500" : "text-gray-600"
                    }`}
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.2 }}
                >
                  {participant.score}点
                </motion.span>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            className="text-center p-6 text-gray-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            参加者を待っています...
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}