"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useAtom, useAtomValue, useSetAtom } from "jotai"
import toast from "react-hot-toast";
import { Drawer } from "vaul"

import { QuizForm } from "@/components/quizForm"
import { drawerOpenAtom, focusedQuizAtom, loadingAtom } from "@/lib/atoms"
import { createQuiz, updateQuiz } from "@/server/actions";
import { QuizSubmit } from "@/types/schemas";

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
        <Drawer.Content className="bg-white flex flex-col fixed bottom-0 left-0 right-0 h-[92dvh] rounded-t-[10px] shadow-lg">
          <motion.div
            className="sticky top-0 bg-gradient-to-r from-blue-50 to-purple-50 pt-6 px-4 rounded-t-[10px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Drawer.Handle className="bg-gray-300 w-10 h-1 rounded-full mx-auto mt-2 mb-4" />
            <Drawer.Title className="font-bold text-lg text-gray-800 mb-4">
              {focusedQuiz === null ? "クイズを追加" : "クイズを編集"}
            </Drawer.Title>
          </motion.div>

          <div className="flex-1 scrollbar-hide overflow-auto px-4 pb-4">
            <AnimatePresence>
              <motion.div
                className="max-w-md w-full mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
              >
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
                    isEdit={focusedQuiz !== null}
                  />
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  )
}