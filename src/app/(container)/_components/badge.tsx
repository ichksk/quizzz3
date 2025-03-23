import { motion } from "framer-motion";

export const ContainerBadge = () => {
  return (
    <motion.span
      className="absolute top-4 right-4 text-5xl transform rotate-12 select-none z-[-1]"
      initial={{ rotate: 12, scale: 0 }}
      animate={{ rotate: 12, scale: 1 }}
      whileHover={{
        scale: 1.5,
        rotate: 20,
        transition: { duration: 0.2 },
      }}
      transition={{ type: "spring", stiffness: 100, damping: 10 }}
    >
      ✨
    </motion.span>
  )
}