"use client";

import React, { useEffect, useState } from "react";
import { db } from "@/lib/firebase"; // firebaseClient のパスはプロジェクトに合わせて変更
import { collection, onSnapshot } from "firebase/firestore";

// ここではアイコンコンポーネントを例としてインポート（実装に合わせて修正）
import { Users, Crown } from "lucide-react";
import { Participant, Room } from "@/types/schemas";
import { useAtom, useAtomValue } from "jotai";
import { meAtom, participantsAtom, roomAtom } from "@/lib/atoms";

export function ParticipantsList() {
  const [participants, setParticipants] = useAtom(participantsAtom);
  const room = useAtomValue(roomAtom) as Room;
  const me = useAtomValue(meAtom) as Participant
  const currentUserId = me.id;
  const roomCode = room.roomCode;

  useEffect(() => {
    // Firestore の room/{roomCode}/participants コレクションを監視
    const colRef = collection(db, `rooms/${roomCode}/participants`);
    const unsubscribe = onSnapshot(
      colRef,
      (snapshot) => {
        const data: Participant[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Participant[];
        setParticipants(data);
      },
      (error) => {
        console.error("参加者の取得に失敗しました:", error);
      }
    );
    return () => unsubscribe();
  }, [roomCode]);

  // 自分自身を除いた参加者リスト
  const participantsExceptMe = participants.filter(
    (p) => p.id !== currentUserId
  );

  return (
    <div className="bg-white border border-gray-300 rounded-lg shadow-sm lg:col-span-1">
      <div className="px-6 py-4 border-b border-gray-300 flex items-center justify-between">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Users className="w-5 h-5" />
          参加者一覧
        </h2>
        <span className="px-2.5 py-0.5 text-xs font-medium bg-gray-100 rounded-full">
          {participantsExceptMe.length}人
        </span>
      </div>
      <div className="p-6">
        <div className="space-y-3">
          {participantsExceptMe.map((participant, index) => (
            <div
              key={participant.id}
              className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50"
            >
              <div className="flex items-center gap-2">
                {index === 0 && participant.score !== 0 && (
                  <Crown className="w-4 h-4 text-yellow-500" />
                )}
                <span>{participant.username}</span>
              </div>
              <span className="text-gray-600">{participant.score}点</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
