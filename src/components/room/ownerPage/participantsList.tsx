"use client";

import { Users, Crown } from "lucide-react";
import { Participant } from "@/types/schemas";
import { useAtomValue } from "jotai";
import { meAtom, participantsAtom } from "@/lib/atoms";

export function ParticipantsList() {
  const participants = useAtomValue(participantsAtom);
  const me = useAtomValue(meAtom) as Participant
  const currentUserId = me.id;


  // 自分自身を除いた参加者リスト
  const participantsExceptMe = participants.filter(
    (p) => p.id !== currentUserId
  );

  return (
    <div className="bg-white border border-gray-300 rounded-lg shadow-sm lg:col-span-1">
      <div className="px-6 py-4 border-b border-gray-300 flex items-center justify-between">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Users className="w-5 h-5" />
          参加者一覧
        </h2>
        <span className="px-2.5 py-0.5 text-xs font-medium bg-gray-100 rounded-full">
          {participantsExceptMe.length}人
        </span>
      </div>
      <div className="p-6">
        <div className="space-y-3">
          {participantsExceptMe.map((participant, index) => (
            <div
              key={participant.id}
              className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50"
            >
              <div className="flex items-center gap-2">
                {index === 0 && participant.score !== 0 && (
                  <Crown className="w-4 h-4 text-yellow-500" />
                )}
                <span>{participant.username}</span>
              </div>
              <span className="text-gray-600">{participant.score}点</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
