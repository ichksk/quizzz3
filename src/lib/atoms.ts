import { atom } from "jotai";

export const loadingAtom = atom(false);  // ローディング状態

import { QuizForm } from "@/types/QuizForm"
import { JoinQuizForm } from "@/types/JoinQuizForm";

export const emptyQuizForm: QuizForm = {
  question: "",
  image: "",
  choices: ["", ""],
  correctChoiceIndex: 0,
  timeLimit: Infinity,
}
export const quizFormAtom = atom<QuizForm>(emptyQuizForm)

export const emptyJoinQuizForm: JoinQuizForm = {
  roomCode: "",
}
export const joinQuizFormAtom = atom<JoinQuizForm>(emptyJoinQuizForm)