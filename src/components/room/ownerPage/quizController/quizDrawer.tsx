"use client";

import { QuizForm } from "@/components/quizForm"
import { drawerOpenAtom, focusedQuizAtom, loadingAtom } from "@/lib/atoms"
import { storage } from "@/lib/firebase";
import { createQuiz, updateQuiz } from "@/server/actions";
import { QuizSubmitForm } from "@/types/schemas";
import { getDownloadURL, ref, uploadBytesResumable, UploadTaskSnapshot } from "firebase/storage";
import { useAtom, useAtomValue, useSetAtom } from "jotai"
import { Trash2 } from "lucide-react"
import toast from "react-hot-toast";
import { Drawer } from "vaul"

export const QuizDrawer = () => {
  const setLoading = useSetAtom(loadingAtom)
  const [drawerOpen, setDrawerOpen] = useAtom(drawerOpenAtom)

  const focusedQuiz = useAtomValue(focusedQuizAtom)

  const handleSubmit = async (formData: QuizSubmitForm) => {
    //focusedQuizがnullなら(新規作成なら)createQuizを呼び出す、
    //focusedQuizがnullでないなら(編集なら)updateQuizを呼び出す

    setLoading(true)
    let imageUrl = null;
    if (formData.image && formData.image instanceof File) {
      const file = formData.image;
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

    if (focusedQuiz === null) {
      const result = await createQuiz({
        question: formData.question,
        timeLimit: formData.timeLimit,
        image: imageUrl,
        choices: formData.choices,
        correctChoiceIndex: formData.correctChoiceIndex,
      })
      if (result.success) {
        toast.success("作成しました")
      } else {
        toast.error("作成に失敗しました")
      }
    } else {
      const result = await updateQuiz(focusedQuiz.id, {
        question: formData.question,
        timeLimit: formData.timeLimit,
        image: imageUrl,
        choices: formData.choices,
        correctChoiceIndex: formData.correctChoiceIndex,
      })
      if (result.success) {
        toast.success("更新しました")
      } else {
        toast.error("更新に失敗しました")
      }
    }

    setLoading(false)
    setDrawerOpen(false)

  };

  return (
    <Drawer.Root
      repositionInputs={false}
      open={drawerOpen}
      onClose={() => setDrawerOpen(false)}
    >
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40" />
        <Drawer.Content className="bg-white flex flex-col fixed bottom-0 left-0 right-0 h-[92dvh] rounded-t-[10px]">
          <div className="sticky top-0 bg-white pt-4 px-4 rounded-t-[10px]">
            <Drawer.Handle />
          </div>
          <div className="flex-1 scrollbar-hide overflow-auto px-4 pb-4">
            <Drawer.Title className="font-medium text-gray-900 mt-8">
              {focusedQuiz === null ? "クイズを追加" : "クイズを編集"}
            </Drawer.Title>
            <div className="max-w-md w-full mx-auto">
              <div className="mt-4">
                <QuizForm
                  initialData={{
                    question: focusedQuiz?.question || "",
                    timeLimit: focusedQuiz?.timeLimit || Infinity,
                    image: null,
                    choices: focusedQuiz?.choices || ["", ""],
                    correctChoiceIndex: focusedQuiz?.correctChoiceIndex || 0,
                    imagePreview: focusedQuiz?.image || null,
                  }}
                  onSubmit={handleSubmit}
                  showBackButton={false}
                  isEdit
                />
              </div>
            </div>
            {focusedQuiz && (
              <>
                <div className="border-t border-gray-300 my-2" />
                <div className="flex items-center justify-center w-full">
                  <button
                    className="inline-flex items-center justify-center gap-2 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                    aria-label="削除"
                    onClick={() => {
                      console.log(focusedQuiz.id)
                    }}
                  >
                    <Trash2 className="w-5 h-5" />
                    <span className="text-sm font-medium">削除する</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  )
}