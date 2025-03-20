import { QuizStatus } from "@prisma/client";

export interface InitQuizSubmit {
  question: string;
  image?: string;
  order?: number;
  status?: QuizStatus;
  timeLimit?: number | null;
  choices: { text: string; isCorrect: boolean, order: number }[];
}