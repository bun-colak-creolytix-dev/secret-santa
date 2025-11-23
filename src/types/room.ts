export interface StoredRoomParticipation {
	roomId: string;
	email: string;
	name: string;
}

export interface UserParticipation {
	name: string;
	email: string;
	note: string | null;
}

export interface Participant {
	id: number;
	name: string;
	email: string;
	note: string | null;
}
