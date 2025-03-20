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
      <label htmlFor="username" className="text-sm font-medium text-gray-700">
        ユーザー名
      </label>
      <input
        type="text"
        id="username"
        value={username}
        onChange={handleOnChange}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
        placeholder="名前を入力してね"
      />
      {showError && (
        <p className="mt-2 text-sm text-red-600 font-medium">{error}</p>
      )}
    </div>
  );
};