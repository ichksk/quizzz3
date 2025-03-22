"use client"

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useState, ChangeEvent, JSX } from 'react';

import { UsernameField } from '@/components/usernameField';
import { getCookie } from '@/server/cookies';
import { Confirm } from '@/components/confirm';

export default function Home(): JSX.Element {
  const router = useRouter();
  const [error, setError] = useState<string>('');
  const [showError, setShowError] = useState<boolean>(false);

  const handleUsernameChange = (e: ChangeEvent<HTMLInputElement>): void => {
    if (showError && e.target.value.trim()) {
      setShowError(false);
    }
  };

  const validateUsername = async () => {
    if (!(await getCookie("username"))?.trim()) {
      setError('名前を入力してくださいっ！🙏');
      setShowError(true);
      return false;
    }
    return true;
  };

  const handleCreateQuiz = async () => {
    if (await validateUsername()) {
      router.push(`/join`);

    }
  };

  const handleJoinQuiz = async () => {
    if (await validateUsername()) {
      router.push(`/join`);
    }
  };

  const buttonVariants = {
    initial: {
      scale: 1,
      boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)"
    },
    hover: {
      scale: 1.05,
      boxShadow: "0px 8px 15px rgba(0, 0, 0, 0.2)"
    },
    tap: {
      scale: 0.98,
      boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.15)"
    }
  };

  const iconVariants = {
    initial: { y: 0, rotate: 0 },
    hover: { y: [0, -8, 0], rotate: [0, -10, 10, -10, 0], transition: { repeat: Infinity, duration: 2 } }
  };

  const glowVariants = {
    initial: { opacity: 0 },
    hover: { opacity: 0.7, transition: { duration: 0.3 } }
  };

  return (
    <div className="max-w-md w-full">
      <div className="flex flex-col gap-8 items-center">
        <div className="flex flex-col items-center">
          <div className="relative">
            <motion.h1
              className="text-3xl sm:text-4xl font-bold text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent whitespace-nowrap"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              クイズ大会メーカー
            </motion.h1>
            <motion.span
              className="absolute -top-6 -right-8 text-5xl transform rotate-12 select-none"
              initial={{ rotate: 12, scale: 0 }}
              animate={{ rotate: 12, scale: 1 }}
              whileHover={{
                scale: 1.5,
                rotate: 20,
                transition: {
                  duration: 0.2
                }
              }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 20,
              }}
            >
              ✨
            </motion.span>
          </div>

          <motion.div
            className="h-2 w-32 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full mt-4 mb-8"
            initial={{ width: 0 }}
            animate={{ width: "8rem" }}
            transition={{ duration: 0.8, delay: 0.3 }}
          />
        </div>

        <UsernameField
          onChange={handleUsernameChange}
          error={error}
          showError={showError}
        />

        <div className="flex flex-col gap-6 w-full">
          <motion.button
            className="relative px-8 py-5 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 text-white rounded-xl font-bold text-lg cursor-pointer overflow-hidden"
            onClick={handleCreateQuiz}
            variants={buttonVariants}
            initial="initial"
            whileHover="hover"
            whileTap="tap"
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-blue-300 to-indigo-400 blur-xl"
              variants={glowVariants}
              initial="initial"
              whileHover="hover"
            />
            <motion.div
              className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-300 via-pink-300 to-blue-300"
              initial={{ scaleX: 0 }}
              whileHover={{ scaleX: 1 }}
              transition={{ duration: 0.3 }}
            />
            <div className="relative z-10 flex items-center justify-center">
              <motion.span
                className="text-2xl mr-3"
                variants={iconVariants}
              >
                ✏️
              </motion.span>
              <span>クイズを作る</span>
            </div>
          </motion.button>

          <motion.button
            className="relative px-8 py-5 bg-gradient-to-r from-green-500 via-teal-500 to-emerald-600 text-white rounded-xl font-bold text-lg cursor-pointer overflow-hidden"
            onClick={handleJoinQuiz}
            variants={buttonVariants}
            initial="initial"
            whileHover="hover"
            whileTap="tap"
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-green-300 to-emerald-400 blur-xl"
              variants={glowVariants}
              initial="initial"
              whileHover="hover"
            />
            <motion.div
              className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-300 via-green-300 to-teal-300"
              initial={{ scaleX: 0 }}
              whileHover={{ scaleX: 1 }}
              transition={{ duration: 0.3 }}
            />
            <div className="relative z-10 flex items-center justify-center">
              <motion.span
                className="text-2xl mr-3"
                animate={{
                  rotate: [0, 0, 270, 270, 0],
                  transition: {
                    repeat: Infinity,
                    duration: 3,
                    times: [0, 0.2, 0.5, 0.8, 1]
                  }
                }}
              >
                🎲
              </motion.span>
              <span>クイズに参加する</span>
            </div>
          </motion.button>
        </div>
      </div>
    </div>
  );
}