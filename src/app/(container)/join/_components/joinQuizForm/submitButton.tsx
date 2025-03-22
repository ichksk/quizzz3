import { motion } from "framer-motion";

export const SubmitButton = () => {
  return (
    <motion.button
      type="submit"
      whileHover={{ scale: 1.03, translateY: -2 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
      className="w-full bg-gradient-to-r from-blue-500 to-blue-700 text-white px-4 py-3 rounded-lg
               shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer font-medium
               border border-blue-400 relative overflow-hidden group"
    >

      <span className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <span className="relative z-10 flex items-center justify-center space-x-2">
        <span>参加する</span>
      </span>
    </motion.button>
  );
};