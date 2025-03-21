"use client";

import { QuizForm } from "@/components/quizForm"
import { drawerOpenAtom, focusedQuizAtom, loadingAtom } from "@/lib/atoms"
import { createQuiz, updateQuiz } from "@/server/actions";
import { QuizSubmit } from "@/types/schemas";
import { useAtom, useAtomValue, useSetAtom } from "jotai"
import { Trash2 } from "lucide-react"
import toast from "react-hot-toast";
import { Drawer } from "vaul"

export const QuizDrawer = () => {
  const setLoading = useSetAtom(loadingAtom)
  const [drawerOpen, setDrawerOpen] = useAtom(drawerOpenAtom)

  const focusedQuiz = useAtomValue(focusedQuizAtom)

  const handleSubmit = async (formData: QuizSubmit) => {
    setLoading(true)

    try {
      if (focusedQuiz === null) {
        const result = await createQuiz(formData)
        if (result.success) {
          toast.success("作成しました")
        } else {
          toast.error("作成に失敗しました")
        }
      } else {
        const result = await updateQuiz(focusedQuiz.id, formData)
        if (result.success) {
          toast.success("更新しました")
        } else {
          toast.error("更新に失敗しました")
        }
      }
    }
    catch (error) {
      console.error("クイズ作成エラー:", error)
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error("クイズの作成に失敗しました")
      }
    }
    finally {
      setLoading(false)
      setDrawerOpen(false)
    }
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
                  isEdit={focusedQuiz !== null}
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