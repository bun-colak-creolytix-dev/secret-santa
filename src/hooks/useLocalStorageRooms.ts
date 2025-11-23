import { LOCAL_STORAGE_KEY } from "@/lib/constants";
import type { StoredRoomParticipation } from "@/types/room";

/**
 * Get all stored room participations from localStorage
 */
export function getStoredRooms(): StoredRoomParticipation[] {
	try {
		const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
		if (!stored) return [];
		return JSON.parse(stored) as StoredRoomParticipation[];
	} catch (error) {
		console.error("Error reading from localStorage:", error);
		return [];
	}
}

/**
 * Get participation for a specific room
 */
export function getRoomParticipation(
	roomId: string,
): StoredRoomParticipation | null {
	const rooms = getStoredRooms();
	return rooms.find((room) => room.roomId === roomId) || null;
}

/**
 * Save room participation to localStorage
 */
export function saveRoomParticipation(
	participation: StoredRoomParticipation,
): void {
	try {
		const rooms = getStoredRooms();
		// Check if already exists to avoid duplicates
		const existingIndex = rooms.findIndex(
			(room) => room.roomId === participation.roomId,
		);
		if (existingIndex >= 0) {
			rooms[existingIndex] = participation;
		} else {
			rooms.push(participation);
		}
		localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(rooms));
	} catch (error) {
		console.error("Failed to save to localStorage:", error);
	}
}
