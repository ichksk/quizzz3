import { atom } from "jotai";

export const loadingAtom = atom(false);  // ローディング状態

import { QuizForm } from "@/types/QuizForm"
import { JoinQuizForm } from "@/types/JoinQuizForm";
import { QuizForOwner } from "@/types/schemas";

export const emptyQuizForm: QuizForm = {
  question: "",
  image: null,
  choices: ["", ""],
  correctChoiceIndex: 0,
  timeLimit: Infinity,
}
export const quizFormAtom = atom<QuizForm>(emptyQuizForm)

export const emptyJoinQuizForm: JoinQuizForm = {
  roomCode: "",
}
export const joinQuizFormAtom = atom<JoinQuizForm>(emptyJoinQuizForm)


export const drawerOpenAtom = atom<boolean>(false);
export const focusedQuizAtom = atom<QuizForOwner | null>(null);