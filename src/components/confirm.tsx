"use client"
import { motion, AnimatePresence } from 'framer-motion'
import { createCallable } from 'react-call'

interface Props { message: string }
type Response = boolean

export const Confirm = createCallable<Props, Response>(({ call, message }) => (
  <AnimatePresence>
    <motion.div
      className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        role="dialog"
        className="bg-white rounded-lg p-6 shadow-xl max-w-md w-full mx-4"
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{
          scale: 1,
          opacity: 1,
          y: 0,
          transition: {
            type: "spring",
            damping: 25,
            stiffness: 300
          }
        }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
      >
        <p className="text-lg mb-4">{message}</p>
        <div className="flex justify-end space-x-3">
          <motion.button
            onClick={() => call.end(false)}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            No
          </motion.button>
          <motion.button
            onClick={() => call.end(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Yes
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  </AnimatePresence>
))

export const ConfirmRoot = () => {
  return (
    <Confirm.Root />
  )
}