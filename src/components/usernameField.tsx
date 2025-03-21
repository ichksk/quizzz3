import { getCookie, setCookie } from '@/server/cookies';
import { ChangeEvent, useEffect, useState } from 'react';

interface UsernameFieldProps {
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  showError?: boolean;
}

export const UsernameField = ({
  onChange,
  error,
  showError
}: UsernameFieldProps) => {
  const [username, setUsername] = useState<string>('');

  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
    setCookie("username", e.target.value);
    onChange?.(e);
  }

  useEffect(() => {
    getCookie("username").then((value) => {
      if (value) {
        setUsername(value);
      }
    });
  }, []);

  return (
    <div className="w-full max-w-md mb-4">
      <label
        htmlFor="username"
        className="block text-sm font-medium text-gray-700 mb-2 flex items-center"
      >
        ユーザー名
      </label>

      <div className="relative">
        <input
          type="text"
          id="username"
          value={username}
          onChange={handleOnChange}
          className="w-full px-4 py-3 border border-gray-300 bg-white rounded-lg
                   focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent
                   shadow-sm hover:shadow transition-all duration-200"
          placeholder="名前を入力してね"
        />
      </div>

      {showError && (
        <p className="mt-2 text-sm text-red-600 font-medium flex items-center">
          {error}
        </p>
      )}
    </div>
  );
}