import { AlertCircle } from "lucide-react";

interface ErrorMessageProps {
  message: string;
}

export const ErrorMessage = ({ message }: ErrorMessageProps) => {
  return (
    <div className="flex items-center gap-1.5 mt-1.5 text-red-600 text-sm" role="alert">
      <AlertCircle className="w-4 h-4" />
      <span>{message}</span>
    </div>
  );
};