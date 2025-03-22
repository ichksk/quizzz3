import { motion } from 'framer-motion';
import { useAtomValue } from 'jotai';
import { Users } from 'lucide-react';

import { LeaveRoomButton } from '@/components/leaveRoomButton';
import { Loading } from '@/components/loading';
import { roomAtom } from '@/lib/atoms';
import { Room } from '@/types/schemas';

export function WaitingPage() {
  const room = useAtomValue(roomAtom) as Room;

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <motion.div
      className="min-h-full flex flex-col items-center justify-center p-4 md:p-8 relative overflow-hidden font-[family-name:var(--font-geist-sans)]"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* メインコンテンツ */}
      <motion.div
        className="bg-white bg-opacity-90 p-8 rounded-2xl shadow-xl text-center space-y-6 backdrop-blur-sm z-10 max-w-md w-full"
        variants={itemVariants}
      >
        <motion.div
          className="flex items-center justify-center space-x-2"
          transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
        >
          <Users className="w-6 h-6 text-blue-500" />
          <motion.h1
            className="text-2xl font-bold text-gray-800"
            animate={{
              color: ['#1e40af', '#4f46e5', '#1e40af']
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            ルームID: {decodeURIComponent(room.roomCode)}
          </motion.h1>
        </motion.div>

        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Loading />
        </motion.div>

        <p
          className="text-xl text-gray-700 font-medium"
        >
          ゲーム開始までお待ちください
        </p>

        <p
          className="text-sm text-gray-500"
        >
          主催者がゲームを開始すると自動的に画面が切り替わります
        </p>

        <motion.div
          className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden mt-6 relative"
          variants={itemVariants}
        >
          {/* Moving dot instead of filling gauge */}
          <motion.div
            className="absolute h-3 w-6 bg-indigo-500 rounded-full top-1/2 transform -translate-y-1/2"
            animate={{
              left: ["0%", "100%", "0%"], // 24px (6rem) is the width of the dot
            }}
            transition={{
              duration: 3.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </motion.div>

      </motion.div>

      <motion.div
        className="mt-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.5 }}
      >
        <LeaveRoomButton />
      </motion.div>
    </motion.div>
  );
}