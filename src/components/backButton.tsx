import { useRouter } from "next/navigation"

interface BackButtonProps {
  to?: string;
}

export const BackButton = ({ to }: BackButtonProps) => {
  const router = useRouter();

  return (
    <button
      type="button"
      className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors duration-200 cursor-pointer"
      onClick={() => router.push(to || "/")}
    >
      戻る
    </button>
  );
};