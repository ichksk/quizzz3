"use client";

import { getCookie, setCookie } from "@/server/cookies";
import { QuizForm } from "@/components/quizForm";
import { loadingAtom, quizFormAtom } from "@/lib/atoms";
import { useAtomValue, useSetAtom } from "jotai";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { createRoom, createQuiz } from "@/server/actions"; // サーバーアクションをインポート
import { getDownloadURL, ref, uploadBytesResumable, UploadTaskSnapshot } from "firebase/storage";
import { storage } from "@/lib/firebase";

export default function CreateQuizPage() {
  const quizData = useAtomValue(quizFormAtom);
  const setLoading = useSetAtom(loadingAtom);
  const router = useRouter();

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // ユーザー名の取得
      const username = await getCookie("username");
      if (!username) {
        toast.error("ユーザー名が設定されていません");
        return;
      }

      // 入力チェック
      if (!quizData.question) {
        toast.error("問題文を入力してください");
        return;
      }
      if (quizData.choices.length < 2) {
        toast.error("選択肢は最低2つ必要です");
        return;
      }

      let imageUrl = null;
      // 画像ファイルがある場合、アップロードを実施
      if (quizData.image && quizData.image instanceof File) {
        const file = quizData.image;
        const storageRef = ref(storage, `images/${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file);

        await new Promise<void>((resolve, reject) => {
          uploadTask.on(
            "state_changed",
            (snapshot: UploadTaskSnapshot) => {
              // 必要に応じて進捗表示などの処理を追加可能
            },
            (error: Error) => {
              console.error("アップロードエラー:", error);
              reject(error);
            },
            () => {
              resolve();
            }
          );
        });
        imageUrl = await getDownloadURL(uploadTask.snapshot.ref);
      }

      // 1. ルーム作成
      const room = await createRoom(username);
      await setCookie("roomCode", room.roomCode);

      // 2. クイズ作成（downloadURL を image プロパティとして渡す）
      await createQuiz({
        roomCode: room.roomCode,
        question: quizData.question,
        choices: quizData.choices.map((choice, index) => ({
          text: choice,
          isCorrect: index === quizData.correctChoiceIndex,
        })),
        timeLimit: quizData.timeLimit,
        order: 0,
        image: imageUrl ?? null,
      });

      toast.success("クイズを作成しました");
      router.push("/room");
    } catch (error) {
      console.error("クイズ作成エラー:", error);
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("クイズの作成に失敗しました");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[100dvh] p-8 pb-20 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-8">クイズを作成</h1>
        <QuizForm
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}