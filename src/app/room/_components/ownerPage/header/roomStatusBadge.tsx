import { RoomStatus } from "@/types/schemas"

export const RoomStatusBadge = ({ status }: { status: RoomStatus }) => {
  const getStatusInfo = () => {
    switch (status) {
      case RoomStatus.WAITING:
        return { text: "参加受付中", className: "text-green-600 border-green-600" }
      case RoomStatus.IN_PROGRESS:
        return { text: "クイズ進行中", className: "text-blue-600 border-blue-600" }
      case RoomStatus.FINISHED:
        return { text: "終了", className: "text-gray-600 border-gray-600" }
      default:
        return { text: "不明", className: "text-gray-600 border-gray-600" }
    }
  }
  const statusInfo = getStatusInfo()

  return (
    <span className={`px-3 py-1 text-sm border rounded-full whitespace-nowrap ${statusInfo.className}`}>
      {statusInfo.text}
    </span>
  )
}