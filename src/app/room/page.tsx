"use client";

import { OwnerPage } from "@/components/room/ownerPage";
import { ParticipantPage } from "@/components/room/participantPage";
import { getParticipant, getRoomData } from "@/server/actions";
import { Participant, RoomForOwner, RoomForParticipant } from "@/types/schemas";
import { notFound } from "next/navigation";
import { useEffect, useState } from "react";
// Firestore 用の import（Firebase の設定済みインスタンス db を使用）
import { onSnapshot, doc } from "firebase/firestore";
import { db } from "@/lib/firebase"; // db のパスはご利用環境に合わせて変更

export default function RoomPage() {
  const [room, setRoom] = useState<RoomForOwner | RoomForParticipant | null>(null);
  const [participant, setParticipant] = useState<Participant | null>(null);

  useEffect(() => {
    // Firestore の購読解除用
    let unsubscribe: () => void;

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

      // onSnapshot でドキュメントの変更を監視
      unsubscribe = onSnapshot(roomDocRef, (docSnapshot) => {
        if (docSnapshot.exists()) {
          // ドキュメントの変更があれば、最新データで setRoom を更新
          console.log(docSnapshot.data())
          setRoom({
            ...room,
            status: docSnapshot.data().status,
            roomCode: docSnapshot.data().roomCode,
            currentOrder: docSnapshot.data().currentOrder,
          })
          // setRoom(docSnapshot.data() as RoomForOwner | RoomForParticipant);
        }
      });
    };

    fetchRoomData();

    // クリーンアップ: コンポーネントのアンマウント時に購読解除
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  if (!participant || !room) return null;

  return participant.isOwner ? (
    <OwnerPage room={room as RoomForOwner} participant={participant} />
  ) : (
    <ParticipantPage room={room as RoomForParticipant} participant={participant} />
  );
}
