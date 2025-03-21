"use client";

import { OwnerPage } from "@/components/room/ownerPage";
import { ParticipantPage } from "@/components/room/participantPage";
import { getParticipant, getRoomData } from "@/server/actions";
import { Participant, QuizForOwner, RoomForOwner, RoomForParticipant } from "@/types/schemas";
import { notFound } from "next/navigation";
import { useEffect, useState } from "react";
import { onSnapshot, doc, collection } from "firebase/firestore";
import { db } from "@/lib/firebase";
import CustomNotFound from "./not-found";

export default function RoomPage() {
  const [room, setRoom] = useState<RoomForOwner | RoomForParticipant | null>();
  const [participant, setParticipant] = useState<Participant | null>();

  useEffect(() => {
    const fetchRoomData = async () => {
      const { room } = await getRoomData();
      const { participant } = await getParticipant();
      if (!room || !participant) {
        notFound();
      }

      setRoom(room);
      setParticipant(participant);
    }
    fetchRoomData();
  }, []);

  // useEffect(() => {
  //   let unsubscribeQuiz: () => void;

  //   (async () => {
  //     const { room } = await getRoomData();
  //     if (room) {
  //       const quizColRef = collection(db, `rooms/${room.roomCode}/quizzes`);
  //       unsubscribeQuiz = onSnapshot(
  //         quizColRef,
  //         (snapshot) => {
  //           const data: QuizForOwner[] = snapshot.docs.map((doc) => ({
  //             id: doc.id,
  //             ...doc.data(),
  //           })) as QuizForOwner[];

  //           if (room) {
  //             setRoom({
  //               ...room,
  //               quizzes: data,
  //             });
  //           }
  //         }
  //       );
  //     }
  //   })()

  //   return () => {
  //     if (unsubscribeQuiz) unsubscribeQuiz();
  //   };
  // }, []);
  // ↑これのせいでroomが更新されなくなる

  useEffect(() => {
    let unsubscribeRoom: () => void;
    (async () => {
      const { room } = await getRoomData();
      if (room) {
        const roomDocRef = doc(db, "rooms", room.roomCode);
        unsubscribeRoom = onSnapshot(
          roomDocRef,
          (snapshot) => {
            if (snapshot.exists() && room) {
              setRoom({
                ...room,
                status: snapshot.data().status,
                roomCode: snapshot.data().roomCode,
                currentOrder: snapshot.data().currentOrder,
              });
            }
          }
        );
      }
    })()

    return () => {
      if (unsubscribeRoom) unsubscribeRoom();
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
