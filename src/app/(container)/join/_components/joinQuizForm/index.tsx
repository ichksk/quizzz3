"use client"

import { useAtomValue, useSetAtom } from 'jotai';
import { useRouter } from 'next/navigation';
import { FormEvent, Suspense } from 'react';
import toast from 'react-hot-toast';

import { UsernameField } from '@/components/usernameField';
import { joinQuizFormAtom, loadingAtom } from '@/lib/atoms';
import { joinRoom } from '@/server/actions'; // サーバーアクションをインポート
import { getCookie } from '@/server/cookies';

import { RoomCodeField } from './roomCodeField';
import { SubmitButton } from './submitButton';
import { Supplements } from './supplements';


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

      const res = await joinRoom(roomCode, username, false);
      if (!res.success) {
        throw new Error(res.error);
      }

      toast.success("ルームに移動します");
      router.push("/room");
    } catch (error) {
      // エラーメッセージがある場合は表示する（より詳細なエラーメッセージを提供）
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("エラーが発生しました");
      }
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
        </div>
      </form>
      <Supplements />
    </Suspense>
  );
};