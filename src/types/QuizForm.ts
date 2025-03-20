export interface QuizForm {
  question: string,
  image: string | null,
  choices: string[],
  correctChoiceIndex: number,
  timeLimit: number
}