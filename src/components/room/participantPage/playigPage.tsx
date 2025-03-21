import { LeaveRoomButton } from "@/components/leaveRoomButton";
import { quizzesAtom, roomAtom } from "@/lib/atoms";
import { QuizForParticipant, Room } from "@/types/schemas";
import { useAtomValue } from "jotai";
import { AnswerClosed } from "./answerClosed";
import { ShowingAnswer } from "./showingAnswer";
import { Answering } from "./answering";

export const PlayingPage = () => {
  const room = useAtomValue(roomAtom) as Room;
  const quizzes = useAtomValue(quizzesAtom);
  const currentQuiz = quizzes.find((quiz) => quiz.order === room.currentOrder) as QuizForParticipant;


  return (
    <div className="min-h-[100dvh] bg-gray-100 p-4 md:p-8">
      <div className="bg-white rounded-lg shadow-lg h-fit p-6 md:p-8">
        <h3 className="text-2xl font-semibold text-gray-800">第{room.currentOrder + 1}問目</h3>
        {currentQuiz.status === "DISPLAYING" && <Answering />}
        {currentQuiz.status === "ANSWER_CLOSED" && <AnswerClosed />}
        {currentQuiz.status === "SHOWING_ANSWER" && <ShowingAnswer />}
      </div>
      <LeaveRoomButton />
    </div>
  );
};
