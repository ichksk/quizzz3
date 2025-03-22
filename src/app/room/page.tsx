"use client";

import { onSnapshot, doc, collection } from "firebase/firestore";
import { useAtom, useSetAtom } from "jotai";
import { notFound } from "next/navigation";
import { useEffect } from "react";


import { loadingAtom, meAtom, participantsAtom, quizAnswersAtom, quizzesAtom, roomAtom } from "@/lib/atoms";
import { db } from "@/lib/firebase";
import { fetchParticipant, fetchRoomData } from "@/server/actions";
import { Participant, QuizAnswer, QuizForOwner, Room } from "@/types/schemas";

import { OwnerPage } from "./_components/ownerPage";
import { ParticipantPage } from "./_components/participantPage";


export default function RoomPage() {
  const setLoading = useSetAtom(loadingAtom)
  const [room, setRoom] = useAtom(roomAtom);
  const [participant, setParticipant] = useAtom(meAtom);
  const [quizzes, setQuizzes] = useAtom(quizzesAtom);
  const setQuizAnswers = useSetAtom(quizAnswersAtom);
  const setParticipants = useSetAtom(participantsAtom)

  useEffect(() => {
    setLoading(true);
    (async () => {
      const { room } = await fetchRoomData();
      const { participant } = await fetchParticipant();
      if (!room || !participant) {
        notFound();
      }

      setRoom(room);
      setParticipant(participant);
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    let unsub: () => void;

    (async () => {
      const { room } = await fetchRoomData();
      if (room) {
        const quizColRef = collection(db, `rooms/${room.roomCode}/quizzes`);
        unsub = onSnapshot(
          quizColRef,
          (snapshot) => {
            const data: QuizForOwner[] = snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            })) as QuizForOwner[];
            if (room) {
              setQuizzes(data);
            }
          }
        );
      }
    })()

    return () => unsub?.();
  }, []);

  useEffect(() => {
    let unsub: () => void;
    (async () => {
      const { room } = await fetchRoomData();
      if (room) {
        const participantColRef = collection(db, `rooms/${room.roomCode}/participants`);
        unsub = onSnapshot(
          participantColRef,
          (snapshot) => {
            const data: Participant[] = snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            })) as Participant[];
            if (room) {
              setParticipants(data);
            }
          },
          (error) => {
            console.error("参加者の取得に失敗しました:", error);
          }
        );
      }
    })()

    return () => unsub?.();
  }, []);

  useEffect(() => {
    let unsub: () => void;
    (async () => {
      const { room } = await fetchRoomData();
      if (room) {
        const roomDocRef = doc(db, "rooms", room.roomCode);
        unsub = onSnapshot(
          roomDocRef,
          (snapshot) => {
            if (snapshot.exists() && room) {
              setRoom(snapshot.data() as Room);
            }
          }
        );
      }
    })()

    return () => unsub?.();
  }, []);

  useEffect(() => {
    let unsub: () => void;
    (async () => {
      const { room } = await fetchRoomData();
      if (room && quizzes && quizzes.length > 0) {
        const currentQuiz = quizzes.find((quiz) => quiz.order === room.currentOrder);
        if (currentQuiz) {
          const quizAnswersColRef = collection(db, `rooms/${room.roomCode}/quizzes/${currentQuiz.id}/answers`);
          unsub = onSnapshot(
            quizAnswersColRef,
            (snapshot) => {
              const data: QuizAnswer[] = snapshot.docs.map((doc) => ({
                participantId: doc.id,
                ...doc.data(),
              })) as QuizAnswer[];
              if (room) {
                setQuizAnswers(data);
              }
            },
          );
        }
      }
    })()

    return () => unsub?.();
  }, [quizzes]);

  if (!room || !participant) return null;

  return (
    <div className="min-h-[100dvh] relative">
      {participant.isOwner ? (
        <OwnerPage />
      ) : (
        <ParticipantPage />
      )}
    </div>
  );
}
