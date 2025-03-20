"use client";

import { OwnerPage } from "@/components/room/ownerPage";
import { ParticipantPage } from "@/components/room/participantPage";
import { getParticipant, getRoomData } from "@/server/actions";
import { Participant, QuizForOwner, RoomForOwner, RoomForParticipant } from "@/types/schemas";
import { notFound } from "next/navigation";
import { useEffect, useState } from "react";
// Firestore 用の import（Firebase の設定済みインスタンス db を使用）
import { onSnapshot, doc, collection } from "firebase/firestore";
import { db } from "@/lib/firebase"; // db のパスはご利用環境に合わせて変更
import CustomNotFound from "./not-found";

export default function RoomPage() {
  const [room, setRoom] = useState<RoomForOwner | RoomForParticipant | null>();
  const [participant, setParticipant] = useState<Participant | null>();

  useEffect(() => {
    // Firestore の購読解除用
    let unsubscribeRoom: () => void;
    let unsubscribeQuiz: () => void;

    const fetchRoomData = async () => {
      const { room } = await getRoomData();
      const { participant } = await getParticipant();
      if (!room || !participant) {
        notFound();
      }

      setRoom(room);
      setParticipant(participant);

      // ここで room の roomCode を利用して Firestore のドキュメントを指定
      // ※ room オブジェクトに roomCode（または code）がある前提です
      const roomDocRef = doc(db, "rooms", room.roomCode);
      const quizColRef = collection(db, `rooms/${room.roomCode}/quizzes`);

      unsubscribeRoom = onSnapshot(
        roomDocRef,
        (snapshot) => {
          if (snapshot.exists()) {
            // ドキュメントの変更があれば、最新データで setRoom を更新
            console.log(snapshot.data())
            if (room) {
              setRoom({
                ...room,
                status: snapshot.data().status,
                roomCode: snapshot.data().roomCode,
                currentOrder: snapshot.data().currentOrder,
              })
            }
          }
        }
      );

      unsubscribeQuiz = onSnapshot(
        quizColRef,
        (snapshot) => {
          const data: QuizForOwner[] = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as QuizForOwner[];

          if (room) {
            setRoom({
              ...room,
              quizzes: data,
            });
          }
          console.log(data)
        }
      );
    };

    fetchRoomData();

    // クリーンアップ: コンポーネントのアンマウント時に購読解除
    return () => {
      if (unsubscribeRoom) unsubscribeRoom();
      if (unsubscribeQuiz) unsubscribeQuiz();
    };
  }, []);

  if (participant === undefined || room === undefined) return null;
  if (!room || !participant) return <CustomNotFound />;

  return participant.isOwner ? (
    <OwnerPage room={room as RoomForOwner} participant={participant} />
  ) : (
    <ParticipantPage room={room as RoomForParticipant} participant={participant} />
  );
}
