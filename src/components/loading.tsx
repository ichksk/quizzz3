"use client"

import { useAtomValue } from "jotai"

import { loadingAtom, percentageAtom } from "@/lib/atoms"

export const Loading = ({ fullScreen }: { fullScreen?: boolean }) => {
  return (
    <div
      className={`
        flex justify-center my-8
        ${fullScreen ? "flex min-h-[100dvh] items-center justify-center" : ""}
      `}
    >
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-white-500 border-t-transparent"></div>
    </div>
  )
}

export const GlobalLoading = () => {
  const loading = useAtomValue(loadingAtom)
  const percentage = useAtomValue(percentageAtom)

  if (!loading) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex flex-col items-center justify-center z-[100] transition-opacity duration-300">
      <div className="flex justify-center my-8">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent"></div>
      </div>
      {percentage && (
        <div className="text-white mt-4 text-lg">
          {percentage}%
        </div>
      )}
    </div>
  )
}