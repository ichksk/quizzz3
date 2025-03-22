import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
interface BackButtonProps {
  to?: string;
}

export const BackButton = ({ to }: BackButtonProps) => {
  const router = useRouter();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5, duration: 0.3 }}
      className="mt-6 text-center"
    >
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => router.push('/')}
        className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
      >
        ← ホームに戻る
      </motion.button>
    </motion.div>
  );
};