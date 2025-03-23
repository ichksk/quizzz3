import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

export const ContainerTitle = () => {
  const pathname = usePathname();
  const prevPathRef = useRef(pathname);

  // 遷移の方向を決定
  let direction: "rtl" | "ltr" = pathname === "/" ? "ltr" : "rtl";
  if (prevPathRef.current === "/" && (pathname === "/new" || pathname === "/join")) {
    direction = "rtl"; // / -> /new, /join: 右から左
  } else if ((prevPathRef.current === "/new" || prevPathRef.current === "/join") && pathname === "/") {
    direction = "ltr"; // /new, /join -> /: 左から右
  }

  useEffect(() => {
    prevPathRef.current = pathname;
  }, [pathname]);

  const getText = () => {
    switch (pathname) {
      case "/":
        return "クイズ大会メーカー";
      case "/new":
        return "クイズを作る";
      case "/join":
        return "クイズに参加する";
      default:
        return "クイズ大会メーカー";
    }
  };

  // パスに応じたグラデーションクラスの切り替え
  const getGradientClasses = () => {
    switch (pathname) {
      case "/":
        return "bg-gradient-to-r from-blue-600 to-purple-600";
      case "/new":
        return "bg-gradient-to-r from-pink-600 to-yellow-500";
      case "/join":
        return "bg-gradient-to-r from-green-500 to-teal-600";
      default:
        return "bg-gradient-to-r from-blue-600 to-purple-600";
    }
  };

  const text = getText();

  return (
    <div className="flex flex-col items-center">
      <AnimatePresence mode="wait">
        <motion.h1
          key={pathname}
          className={`text-3xl sm:text-4xl font-bold text-center bg-clip-text text-transparent whitespace-nowrap ${getGradientClasses()}`}
          initial={{ x: direction === "rtl" ? 100 : -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: direction === "rtl" ? 100 : -100, opacity: 0 }}
          transition={{ duration: 0.6 }}
        >
          {text}
        </motion.h1>
      </AnimatePresence>
      <motion.span
        key={pathname}
        className="absolute -top-6 -right-8 text-5xl transform rotate-12 select-none"
        initial={{ rotate: 12, scale: 0 }}
        animate={{ rotate: 12, scale: 1 }}
        whileHover={{
          scale: 1.5,
          rotate: 20,
          transition: { duration: 0.2 },
        }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        ✨
      </motion.span>
      <AnimatePresence mode="wait">
        <motion.div
          key={pathname}
          className={`h-2 w-[12rem] ${getGradientClasses()} rounded-full mt-4 mb-8`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
        />
      </AnimatePresence>
    </div>
  );
};
