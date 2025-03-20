import { atom } from "jotai";

export const loadingAtom = atom(false);  // ローディング状態

import { JoinQuizForm } from "@/types/JoinQuizForm";
import { QuizForOwner, QuizSubmitForm } from "@/types/schemas";

export const emptyQuizForm: QuizSubmitForm = {
  question: "",
  image: null,
  imagePreview: null,
  choices: ["", ""],
  correctChoiceIndex: 0,
  timeLimit: Infinity,
}
export const quizFormAtom = atom<QuizSubmitForm>(emptyQuizForm)

export const emptyJoinQuizForm: JoinQuizForm = {
  roomCode: "",
}
export const joinQuizFormAtom = atom<JoinQuizForm>(emptyJoinQuizForm)


export const drawerOpenAtom = atom<boolean>(false);
export const focusedQuizAtom = atom<QuizForOwner | null>(null);