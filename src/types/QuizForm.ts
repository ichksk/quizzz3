export interface QuizForm {
  question: string,
  image?: string,
  choices: string[],
  correctChoiceIndex: number | null
  timeLimit: number
}