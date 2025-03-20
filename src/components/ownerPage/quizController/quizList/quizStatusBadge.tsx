import { QuizStatus } from "@/types/models";

export const QuizStatusBadge = ({ status }: { status: QuizStatus }) => {
  const getStatusStyles = () => {
    switch (status) {
      case QuizStatus.DRAFT:
        return "bg-blue-100 text-blue-800";
      case QuizStatus.READY:
        return "bg-green-100 text-green-800";
      case QuizStatus.WAITING:
        return "bg-yellow-100 text-yellow-800";
      case QuizStatus.DISPLAYING:
        return "bg-purple-100 text-purple-800";
      case QuizStatus.ANSWERING:
        return "bg-indigo-100 text-indigo-800";
      case QuizStatus.ANSWER_CLOSED:
        return "bg-orange-100 text-orange-800";
      case QuizStatus.SHOWING_ANSWER:
        return "bg-sky-100 text-sky-800";
      case QuizStatus.COMPLETED:
        return "bg-emerald-100 text-emerald-800";
      case QuizStatus.CANCELLED:
        return "bg-red-100 text-red-800";
      case QuizStatus.DELETED:
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = () => {
    switch (status) {
      case QuizStatus.DRAFT:
        return "下書き";
      case QuizStatus.READY:
        return "準備完了";
      case QuizStatus.WAITING:
        return "出題待ち状態";
      case QuizStatus.DISPLAYING:
        return "問題表示中";
      case QuizStatus.ANSWERING:
        return "回答受付中";
      case QuizStatus.ANSWER_CLOSED:
        return "回答締切";
      case QuizStatus.SHOWING_ANSWER:
        return "正解発表中";
      case QuizStatus.COMPLETED:
        return "出題完了";
      case QuizStatus.CANCELLED:
        return "出題キャンセル";
      case QuizStatus.DELETED:
        return "削除";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <span
      className={`px-2.5 py-0.5 text-xs font-medium rounded-full whitespace-nowrap ${getStatusStyles()}`}
    >
      {getStatusText()}
    </span>
  );
};
