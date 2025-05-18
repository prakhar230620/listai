"use client"

import { motion } from "framer-motion"
import { Check } from "lucide-react"

interface SuccessAnimationProps {
  message?: string
  onComplete?: () => void
}

export default function SuccessAnimation({ message = "Success!", onComplete }: SuccessAnimationProps) {
  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onComplete}
    >
      <motion.div
        className="bg-white dark:bg-gray-900 rounded-2xl p-8 flex flex-col items-center max-w-xs mx-auto"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ type: "spring", damping: 20, stiffness: 300 }}
      >
        <motion.div
          className="w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-4"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", delay: 0.2, damping: 10 }}
        >
          <motion.div
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <Check className="w-10 h-10 text-green-600 dark:text-green-400" strokeWidth={3} />
          </motion.div>
        </motion.div>

        <motion.h2
          className="text-xl font-bold text-center mb-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          {message}
        </motion.h2>

        <motion.p
          className="text-sm text-gray-500 dark:text-gray-400 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Tap anywhere to continue
        </motion.p>
      </motion.div>
    </motion.div>
  )
}
