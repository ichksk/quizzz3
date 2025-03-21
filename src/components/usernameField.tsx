import { getCookie, setCookie } from '@/server/cookies';
import { ChangeEvent, useEffect, useState } from 'react';
import { motion } from 'framer-motion';

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
      <motion.label
        initial={{ opacity: 0, x: -5 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        htmlFor="username"
        className="block text-sm font-medium text-gray-700 mb-2 flex items-center"
      >
        <span className="mr-2">👤</span>
        ユーザー名
      </motion.label>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="relative"
      >
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
      </motion.div>

      {showError && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="mt-2 text-sm text-red-600 font-medium flex items-center"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
};