"use client"

import { useRouter } from 'next/navigation';
import { FormEvent, Suspense } from 'react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

import { useAtomValue, useSetAtom } from 'jotai';
import { joinQuizFormAtom, loadingAtom } from '@/lib/atoms';
import { RoomCodeField } from './roomCodeField';
import { SubmitButton } from './submitButton';
import { Supplements } from './supplements';
import { UsernameField } from '../usernameField';
import { BackButton } from '../backButton';
import { getCookie } from '@/server/cookies';
import { joinRoom } from '@/server/actions';

export const JoinQuizForm = () => {
  const { roomCode } = useAtomValue(joinQuizFormAtom)
  const router = useRouter();
  const setLoading = useSetAtom(loadingAtom);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const username = await getCookie("username") as string;
    let error = false;
    if (!roomCode) {
      toast.error("ルームコードを入力してください");
      error = true;
    }
    if (!username) {
      toast.error("ユーザー名を入力してください");
      error = true;
    }
    if (error) return;

    try {
      setLoading(true);
      await joinRoom(roomCode, username, false);
      toast.success("ルームに移動します");
      router.push("/room");
    } catch (error) {
      console.error("ルーム参加エラー:", error);
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("エラーが発生しました");
      }
    } finally {
      setLoading(false);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  return (
    <Suspense>
      <motion.form
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        <motion.div variants={itemVariants} className="transform transition-all hover:scale-[1.02] focus-within:scale-[1.02]">
          <RoomCodeField />
        </motion.div>

        <motion.div variants={itemVariants} className="transform transition-all hover:scale-[1.02] focus-within:scale-[1.02]">
          <UsernameField />
        </motion.div>

        <motion.div variants={itemVariants} className="flex flex-col gap-4">
          <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="shadow-md hover:shadow-lg transition-shadow"
          >
            <SubmitButton />
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <BackButton />
          </motion.div>
        </motion.div>
      </motion.form>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.4 }}
      >
        <Supplements />
      </motion.div>
    </Suspense>
  );
};