import { getCookie } from "@/server/cookies";
import CustomNotFound from "@/components/CustomNotFound";

export default async function RoomPage() {
  const roomCode = await getCookie("roomCode")
  const username = await getCookie("username")

  return <CustomNotFound />
}