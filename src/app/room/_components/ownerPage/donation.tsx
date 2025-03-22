import { motion, Variants } from "framer-motion"
import Link from "next/link"

export const Donation = ({ variants }: { variants: Variants }) => {

  return (
    <motion.div
      variants={variants}
      className="mt-8 p-4 border rounded text-center"
    >
      <p className="text-lg font-semibold">
        このアプリを楽しんでいただけましたか？
        <br />
        あなたのサポートが、さらなる進化への原動力になります！
      </p>
      <p className="text-sm text-gray-600 mt-2">
        いただいた寄付は、新機能の開発やサーバー維持など、
        <br />
        より良いアプリ体験のために大切に使わせていただきます。
        <br />
        （もちろん任意ですので、お気持ちだけでも嬉しいです）
      </p>
      <Link
        href="https://buy.stripe.com/test_3cs00kdfv3Rp2fCcMM"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block mt-3 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        サポートする
      </Link>
    </motion.div>
  )
}