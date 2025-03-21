"use client"

import { FormEvent, useEffect } from 'react';
import { useAtom, useSetAtom } from 'jotai';
import { emptyQuizForm, loadingAtom, quizFormAtom } from '@/lib/atoms';
import { TimeLimitField } from './timeLimitField';
import { ImageField } from './imageField';
import { ChoicesField } from './choicesField';
import { BackButton } from '../backButton';
import { QuestionField } from './questionField';
import { SubmitButton } from './submitButton';
import { QuizSubmit, QuizSubmitForm } from '@/types/schemas';
import { getDownloadURL, ref, uploadBytesResumable, UploadTaskSnapshot } from 'firebase/storage';
import { storage } from '@/lib/firebase';
import toast from 'react-hot-toast';
import { getCookie } from '@/server/cookies';

interface QuizFormProps {
  initialData?: QuizSubmitForm | null;
  showBackButton?: boolean;
  isEdit?: boolean;
  onSubmit: (quizForm: QuizSubmit) => Promise<void>;
}

export const QuizForm = ({
  initialData = null,
  showBackButton = true,
  isEdit = false,
  onSubmit,
}: QuizFormProps) => {
  const setLoading = useSetAtom(loadingAtom)

  const [quizForm, setQuizForm] = useAtom(quizFormAtom);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const username = await getCookie("username");
    if (!username) {
      toast.error("ユーザー名が設定されていません");
      return;
    }

    if (!quizForm.question) {
      toast.error("問題文を入力してください");
      return;
    }
    if (quizForm.choices.length < 2) {
      toast.error("選択肢は最低2つ必要です");
      return;
    }

    let image = quizForm.imagePreview;
    if (quizForm.image && quizForm.image instanceof File) {
      setLoading(true)
      const file = quizForm.image;
      const storageRef = ref(storage, `images/${crypto.randomUUID()}`);
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
      image = await getDownloadURL(uploadTask.snapshot.ref);
    }

    onSubmit({
      ...quizForm,
      image,
    });
  };

  useEffect(() => {
    if (initialData) {
      setQuizForm(initialData);
    } else {
      setQuizForm(emptyQuizForm)
    }
  }, [initialData]);

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <label htmlFor="question" className="block font-medium">
          問題文
        </label>
        <QuestionField />
      </div>
      <TimeLimitField />
      <ImageField />
      <ChoicesField />
      <div className="flex gap-4 pt-4">
        {showBackButton && <BackButton />}
        <SubmitButton isEdit={isEdit} />
      </div>
    </form>
  );
};