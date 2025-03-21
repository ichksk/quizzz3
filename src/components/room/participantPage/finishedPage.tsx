import { leaveRoom } from '@/server/actions';
import { Trophy, Medal, Target, Home } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

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

  const confettiColors = ['#FFD700', '#FF6B6B', '#4CC2FF', '#9F44D3', '#F7CAC9'];

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100 p-4 md:p-8 flex flex-col items-center justify-center"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Floating confetti elements */}
      {Array.from({ length: 30 }).map((_, i) => (
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

      {/* Trophies Animation */}
      <motion.div
        className="absolute top-16 left-1/2 transform -translate-x-1/2 flex space-x-8 md:space-x-16"
        variants={itemVariants}
      >
        <motion.div
          animate={{
            y: [0, -10, 0],
            rotate: [-5, 0, 5, 0]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        >
          <Trophy className="w-12 h-12 md:w-16 md:h-16 text-yellow-400 drop-shadow-lg" />
        </motion.div>
        <motion.div
          animate={{
            y: [0, -8, 0],
            rotate: [5, 0, -5, 0]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            repeatType: "reverse",
            delay: 0.5
          }}
        >
          <Medal className="w-10 h-10 md:w-14 md:h-14 text-purple-400 drop-shadow-lg" />
        </motion.div>
        <motion.div
          animate={{
            y: [0, -12, 0],
            rotate: [-3, 0, 3, 0]
          }}
          transition={{
            duration: 3.5,
            repeat: Infinity,
            repeatType: "reverse",
            delay: 1
          }}
        >
          <Target className="w-10 h-10 md:w-14 md:h-14 text-blue-400 drop-shadow-lg" />
        </motion.div>
      </motion.div>

      {/* 結果ヘッダー */}
      <motion.div
        className="text-center mb-8 mt-24"
        variants={itemVariants}
      >
        <motion.h1
          className="text-4xl md:text-5xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-500"
          animate={{
            scale: [1, 1.05, 1],
            textShadow: ["0px 0px 0px rgba(104, 58, 237, 0)", "0px 0px 10px rgba(104, 58, 237, 0.3)", "0px 0px 0px rgba(104, 58, 237, 0)"]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: "loop"
          }}
        >
          クイズ終了！
        </motion.h1>
        <motion.p
          className="text-lg md:text-xl text-gray-600"
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          全員の回答が完了しました
        </motion.p>
      </motion.div>

      {/* ホームに戻るボタン */}
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