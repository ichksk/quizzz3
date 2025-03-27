import { meAtom, participantsAtom, roomAtom } from "@/lib/atoms";
import { leaveRoom } from "@/server/actions";
import { useSetAtom } from "jotai";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export const useLeaveRoom = () => {
  const router = useRouter();
  const setRoom = useSetAtom(roomAtom);
  const setParticipants = useSetAtom(participantsAtom);
  const setParticipant = useSetAtom(meAtom);
  const handleLeaveRoom = async () => {
    const res = await leaveRoom();
    if (res.success) {
      router.push("/");
      setRoom(null);
      setParticipants([]);
      setParticipant(null);
    }
    else {
      toast.error(res.error!);
    }
  };
  return handleLeaveRoom;
}