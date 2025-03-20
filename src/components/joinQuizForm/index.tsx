"use client"

import { useRouter } from 'next/navigation';
import { FormEvent, Suspense } from 'react';
import toast from 'react-hot-toast';

import { useAtomValue, useSetAtom } from 'jotai';
import { joinQuizFormAtom, loadingAtom } from '@/lib/atoms';
import { RoomCodeField } from './roomCodeField';
import { SubmitButton } from './submitButton';
import { Supplements } from './supplements';
import { UsernameField } from '../usernameField';
import { BackButton } from '../backButton';
import { getCookie, setCookie } from '@/backend/cookies';
import { joinRoom } from '@/backend/joinRoom';

export const JoinQuizForm = () => {
  const { roomCode } = useAtomValue(joinQuizFormAtom)
  const router = useRouter();
  const setLoading = useSetAtom(loadingAtom);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const username = await getCookie("username");
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
    setLoading(true);

    try {
      const { success, error, room } = await joinRoom(roomCode, username as string, false);
      if (!success) {
        error && toast.error(error);
        return;
      }

      room && await setCookie("roomCode", room.roomCode)

      toast.success("ルームに移動します");
      router.push("/room");
    } catch {
      toast.error("エラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Suspense>
      <form onSubmit={handleSubmit} className="space-y-6">
        <RoomCodeField />
        <UsernameField />
        <div className="flex flex-col gap-4">
          <SubmitButton />
          <BackButton />
        </div>
      </form>
      <Supplements />
    </Suspense>
  );
};
