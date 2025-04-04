import { motion, AnimatePresence } from "framer-motion";
import { useAtom } from "jotai";
import { X } from "lucide-react";
import { ChangeEvent, useRef } from "react";

import { quizFormAtom } from "@/lib/atoms";

import { ImagePreview } from "../imagePreview";

export const ImageField = () => {
  const [quizForm, setQuizForm] = useAtom(quizFormAtom);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setQuizForm((prev) => ({
        ...prev,
        imagePreview: URL.createObjectURL(file),
        image: file,
      }));
    };
  };


  const handleDeleteImage = () => {
    setQuizForm((prev) => ({
      ...prev,
      image: null,
      imagePreview: null,
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-2">
      <label htmlFor="image" className="block font-medium">
        画像（任意）
      </label>
      <div className="relative">
        <input
          type="file"
          id="image"
          ref={fileInputRef}
          accept="image/*"
          className="hidden"
          onChange={handleImageChange}
        />
        <label
          htmlFor="image"
          className="flex flex-col items-center justify-center w-full p-6 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 cursor-pointer"
        >
          <svg
            className="w-8 h-8 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 4v16m8-8H4"
            />
          </svg>
          <span className="text-sm text-gray-600 mt-2">
            クリックして画像を選択
          </span>
          <span className="text-xs text-gray-400">PNG, JPG, GIF</span>
        </label>
      </div>
      <AnimatePresence>
        {quizForm.imagePreview && (
          <div
            className="mt-4 relative"
          >
            <button
              onClick={handleDeleteImage}
              className="absolute top-2 right-2 p-1 bg-gray-800 rounded-full text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 cursor-pointer"
              type="button"
              aria-label="画像を削除"
            >
              <X className="w-4 h-4" />
            </button>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
              className="flex justify-center"
            >
              <ImagePreview image={quizForm.imagePreview} />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};