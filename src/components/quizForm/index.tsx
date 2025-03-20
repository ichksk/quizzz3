// CreateQuizForm.tsx
"use client"

import { FormEvent, useEffect } from 'react';
import { useAtom } from 'jotai';
import { emptyQuizForm, quizFormAtom } from '@/lib/atoms';
import { TimeLimitField } from './timeLimitField';
import { ImageField } from './imageField';
import { ChoicesField } from './choicesField';
import { BackButton } from '../backButton';
import { QuestionField } from './questionField';
import { SubmitButton } from './submitButton';
import { QuizSubmitForm } from '@/types/schemas';

interface QuizFormProps {
  initialData?: QuizSubmitForm | null;
  showBackButton?: boolean;
  isEdit?: boolean;
  onSubmit: (formData: QuizSubmitForm) => Promise<void>;
}

export const QuizForm = ({
  initialData = null,
  showBackButton = true,
  isEdit = false,
  onSubmit,
}: QuizFormProps) => {
  const [quizForm, setQuizForm] = useAtom(quizFormAtom);

  useEffect(() => {
    if (initialData) {
      setQuizForm(initialData);
    } else {
      setQuizForm(emptyQuizForm)
    }
  }, [initialData]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(quizForm);
  };

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