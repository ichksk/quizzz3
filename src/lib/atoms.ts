import { atom } from "jotai";

export const loadingAtom = atom(false);  // ローディング状態

import { JoinQuizForm } from "@/types/JoinQuizForm";
import { Participant, QuizAnswer, QuizForOwner, QuizForParticipant, QuizSubmitForm, RoomForParticipant } from "@/types/schemas";

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



export const roomAtom = atom<RoomForParticipant | null>(null); //RoomStatus、CurrentOrderの変更をリアルタイムで検知
export const participantsAtom = atom<Participant[]>([]); //Participantsの入退室の変更をリアルタイムで検知
export const quizzesAtom = atom<QuizForParticipant[] | QuizForOwner[]>([]); //Quizの追加/編集/削除の変更をリアルタイムで検知
export const quizAnswersAtom = atom<QuizAnswer[]>([]); //Quizの回答の変更をリアルタイムで検知