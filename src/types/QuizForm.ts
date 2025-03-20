export interface QuizForm {
  question: string,
  image: File | null,
  choices: string[],
  correctChoiceIndex: number,
  timeLimit: number
}