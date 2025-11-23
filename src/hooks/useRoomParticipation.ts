import { useState, useEffect } from "react";
import type { Participant, UserParticipation } from "@/types/room";
import { getRoomParticipation } from "./useLocalStorageRooms";

interface UseRoomParticipationProps {
	roomId: string;
	participants: Participant[];
}

/**
 * Hook to check if user has already joined a room
 */
export function useRoomParticipation({
	roomId,
	participants,
}: UseRoomParticipationProps) {
	const [hasJoined, setHasJoined] = useState(false);
	const [userParticipation, setUserParticipation] =
		useState<UserParticipation | null>(null);

	useEffect(() => {
		const stored = getRoomParticipation(roomId);
		if (stored) {
			setHasJoined(true);
			// Find full participant data from participants list
			const fullData = participants.find((p) => p.email === stored.email);
			if (fullData) {
				setUserParticipation({
					name: fullData.name,
					email: fullData.email,
					note: fullData.note,
				});
			}
		}
	}, [roomId, participants]);

	return { hasJoined, userParticipation, setHasJoined, setUserParticipation };
}
