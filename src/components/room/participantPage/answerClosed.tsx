import { motion } from "framer-motion";

export const AnswerClosed = () => {
  return (
    <motion.div
      className="text-center flex flex-col items-center space-y-6 py-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="relative"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.p
          className="text-3xl md:text-4xl font-bold text-purple-600"
          animate={{
            textShadow: ["0px 0px 0px rgba(124, 58, 237, 0)", "0px 0px 8px rgba(124, 58, 237, 0.3)", "0px 0px 0px rgba(124, 58, 237, 0)"]
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          回答終了！
        </motion.p>
      </motion.div>

      <motion.p
        className="text-lg md:text-xl text-gray-600"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        主催者がまもなく正解を発表します
      </motion.p>

      <motion.div
        className="w-16 h-1 bg-gradient-to-r from-purple-400 to-blue-500 rounded-full mt-2"
        initial={{ width: "0%" }}
        animate={{ width: "4rem" }}
        transition={{ delay: 0.6, duration: 0.5 }}
      />
    </motion.div>
  );
};