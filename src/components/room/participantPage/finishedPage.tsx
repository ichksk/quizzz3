import { motion } from 'framer-motion';
import { Home } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { leaveRoom } from '@/server/actions';

export function FinishedPage() {
  const router = useRouter();

  const goBackHome = async () => {
    const res = await leaveRoom();
    if (res.success) {
      router.push('/');
    }
  }

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
      className="min-h-full p-4 md:p-8 flex flex-col items-center justify-center"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div
        className="text-center mb-8 mt-24"
        variants={itemVariants}
      >
        <motion.h1
          className="text-4xl md:text-5xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-500"
          animate={{
            textShadow: ["0px 0px 0px rgba(104, 58, 237, 0)", "0px 0px 10px rgba(104, 58, 237, 0.3)", "0px 0px 0px rgba(104, 58, 237, 0)"]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: "loop"
          }}
        >
          クイズ終了
        </motion.h1>
      </motion.div>

      <motion.div
        className="text-center mt-8"
        variants={itemVariants}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <motion.button
          className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white py-3 px-8 rounded-full font-semibold transition-all shadow-lg flex items-center mx-auto space-x-2"
          onClick={goBackHome}
          initial={{ boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)" }}
          whileHover={{
            boxShadow: "0px 7px 15px rgba(0, 0, 0, 0.2)",
          }}
        >
          <Home className="w-5 h-5" />
          <span>ホームに戻る</span>
        </motion.button>
      </motion.div>
    </motion.div>
  );
}