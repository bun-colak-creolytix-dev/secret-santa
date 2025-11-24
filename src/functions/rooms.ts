import { createServerFn } from "@tanstack/react-start";
import { and, eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { Resend } from "resend";
import { z } from "zod";
import { db } from "@/db";
import { participants, rooms } from "@/db/schema";
import { env } from "@/env";
import { rateLimitMiddleware } from "@/middleware";

// Input validation schema
const createRoomSchema = z.object({
	name: z.string().min(3, "Room name must be at least 3 characters"),
	organizerName: z.string().min(2, "Name must be at least 2 characters"),
	organizerEmail: z.email("Please enter a valid email address"),
});

export type CreateRoomInput = z.infer<typeof createRoomSchema>;

// Server function to create a room
export const createRoom = createServerFn({ method: "POST" })
	.middleware([rateLimitMiddleware])
	.inputValidator(createRoomSchema)
	.handler(async (ctx) => {
		const validated = ctx.data;

		// Generate a unique room ID and admin key
		const roomId = nanoid(10);
		const adminKey = nanoid(32);

		// Insert the room into the database
		const [newRoom] = await db
			.insert(rooms)
			.values({
				id: roomId,
				name: validated.name,
				organizerName: validated.organizerName,
				organizerEmail: validated.organizerEmail,
				adminKey: adminKey,
			})
			.returning();

		// Auto-add the creator as a participant
		await db.insert(participants).values({
			roomId: roomId,
			name: validated.organizerName,
			email: validated.organizerEmail,
			note: null,
		});

		return {
			id: newRoom.id,
			name: newRoom.name,
			organizerName: newRoom.organizerName,
			organizerEmail: newRoom.organizerEmail,
			adminKey: newRoom.adminKey,
		};
	});

// Input validation schema for getting room
const getRoomSchema = z.object({
	roomId: z.string().min(1, "Room ID is required"),
});

export type GetRoomInput = z.infer<typeof getRoomSchema>;

// Server function to get room with participants
export const getRoomWithParticipants = createServerFn({ method: "GET" })
	.inputValidator(getRoomSchema)
	.handler(async (ctx) => {
		const validated = ctx.data;

		// Fetch the room
		const [room] = await db
			.select()
			.from(rooms)
			.where(eq(rooms.id, validated.roomId))
			.limit(1);

		if (!room) {
			throw new Error("Room not found");
		}

		// Fetch all participants for this room
		const roomParticipants = await db
			.select()
			.from(participants)
			.where(eq(participants.roomId, validated.roomId))
			.orderBy(participants.createdAt);

		return {
			room: {
				id: room.id,
				name: room.name,
				organizerName: room.organizerName,
				organizerEmail: room.organizerEmail,
				isDrawn: room.isDrawn,
				adminKey: room.adminKey,
			},
			participants: roomParticipants.map((p) => ({
				id: p.id,
				name: p.name,
				email: p.email,
				note: p.note,
			})),
		};
	});

// Input validation schema for joining a room
const joinRoomSchema = z.object({
	roomId: z.string().min(1, "Room ID is required"),
	name: z.string().min(2, "Name must be at least 2 characters"),
	email: z.email("Please enter a valid email address"),
	note: z.string().optional(),
});

export type JoinRoomInput = z.infer<typeof joinRoomSchema>;

// Server function to join a room
export const joinRoom = createServerFn({ method: "POST" })
	.inputValidator(joinRoomSchema)
	.handler(async (ctx) => {
		const validated = ctx.data;

		// Check if the email already exists in this room
		const [existingParticipant] = await db
			.select()
			.from(participants)
			.where(
				and(
					eq(participants.roomId, validated.roomId),
					eq(participants.email, validated.email),
				),
			)
			.limit(1);

		if (existingParticipant) {
			throw new Error("This email has already joined this room");
		}

		// Insert the new participant
		const [newParticipant] = await db
			.insert(participants)
			.values({
				roomId: validated.roomId,
				name: validated.name,
				email: validated.email,
				note: validated.note || null,
			})
			.returning();

		return {
			id: newParticipant.id,
			name: newParticipant.name,
			email: newParticipant.email,
			note: newParticipant.note,
		};
	});

// Input validation schema for admin access
const getAdminRoomSchema = z.object({
	roomId: z.string().min(1, "Room ID is required"),
	adminKey: z.string().min(1, "Admin key is required"),
});

export type GetAdminRoomInput = z.infer<typeof getAdminRoomSchema>;

// Server function to verify admin access and get room data
export const getAdminRoom = createServerFn({ method: "GET" })
	.inputValidator(getAdminRoomSchema)
	.handler(async (ctx) => {
		const validated = ctx.data;

		// Fetch the room and verify admin key
		const [room] = await db
			.select()
			.from(rooms)
			.where(
				and(
					eq(rooms.id, validated.roomId),
					eq(rooms.adminKey, validated.adminKey),
				),
			)
			.limit(1);

		if (!room) {
			throw new Error("Invalid room or admin key");
		}

		// Fetch all participants for this room
		const roomParticipants = await db
			.select()
			.from(participants)
			.where(eq(participants.roomId, validated.roomId))
			.orderBy(participants.createdAt);

		// If names have been drawn, also fetch assigned participant details
		let participantsWithAssignments = roomParticipants.map((p) => ({
			id: p.id,
			name: p.name,
			email: p.email,
			note: p.note,
			assignedToId: p.assignedToId,
			assignedTo: undefined as { name: string; email: string } | undefined,
		}));

		if (room.isDrawn) {
			// For each participant, fetch their assigned recipient
			participantsWithAssignments = await Promise.all(
				roomParticipants.map(async (p) => {
					let assignedTo: { name: string; email: string } | undefined;

					if (p.assignedToId) {
						const [assigned] = await db
							.select({
								name: participants.name,
								email: participants.email,
							})
							.from(participants)
							.where(eq(participants.id, p.assignedToId))
							.limit(1);

						assignedTo = assigned;
					}

					return {
						id: p.id,
						name: p.name,
						email: p.email,
						note: p.note,
						assignedToId: p.assignedToId,
						assignedTo,
					};
				}),
			);
		}

		return {
			room: {
				id: room.id,
				name: room.name,
				organizerName: room.organizerName,
				organizerEmail: room.organizerEmail,
				isDrawn: room.isDrawn,
			},
			participants: participantsWithAssignments,
		};
	});

// Helper function: Fisher-Yates shuffle algorithm
function shuffleArray<T>(array: T[]): T[] {
	const shuffled = [...array];
	for (let i = shuffled.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
	}
	return shuffled;
}

// Input validation schema for drawing names
const drawNamesSchema = z.object({
	roomId: z.string().min(1, "Room ID is required"),
	adminKey: z.string().min(1, "Admin key is required"),
});

export type DrawNamesInput = z.infer<typeof drawNamesSchema>;

// Server function to draw names and assign Secret Santa pairs
export const drawNames = createServerFn({ method: "POST" })
	.inputValidator(drawNamesSchema)
	.handler(async (ctx) => {
		const validated = ctx.data;

		// Verify admin access and get room
		const [room] = await db
			.select()
			.from(rooms)
			.where(
				and(
					eq(rooms.id, validated.roomId),
					eq(rooms.adminKey, validated.adminKey),
				),
			)
			.limit(1);

		if (!room) {
			throw new Error("Invalid room or admin key");
		}

		// Check if names have already been drawn
		if (room.isDrawn) {
			throw new Error("Names have already been drawn for this room");
		}

		// Fetch all participants for this room
		const roomParticipants = await db
			.select()
			.from(participants)
			.where(eq(participants.roomId, validated.roomId));

		// Validate minimum participants
		if (roomParticipants.length < 3) {
			throw new Error("At least 3 participants are required to draw names");
		}

		// Shuffle participants using Fisher-Yates algorithm
		const shuffled = shuffleArray(roomParticipants);

		// Create circular assignment (each person gives to the next, last gives to first)
		const assignments = shuffled.map((giver, index) => {
			const receiverIndex = (index + 1) % shuffled.length;
			const receiver = shuffled[receiverIndex];
			return {
				giverId: giver.id,
				receiverId: receiver.id,
				giverEmail: giver.email,
				giverName: giver.name,
				receiverName: receiver.name,
				receiverEmail: receiver.email,
				receiverNote: receiver.note,
			};
		});

		// Update database with assignments
		await db.transaction(async (tx) => {
			// Update each participant with their assigned recipient
			for (const assignment of assignments) {
				await tx
					.update(participants)
					.set({ assignedToId: assignment.receiverId })
					.where(eq(participants.id, assignment.giverId));
			}

			// Mark room as drawn
			await tx
				.update(rooms)
				.set({ isDrawn: true })
				.where(eq(rooms.id, validated.roomId));
		});

		// Initialize Resend client
		const resend = new Resend(env.RESEND_API_KEY);

		const emailPayloads = assignments.map((assignment) => {
			const giftPreferences = assignment.receiverNote
				? `\n\nGift Preferences:\n${assignment.receiverNote}`
				: "";

			return {
				from: "Secret Santa <noreply@santa.buncolak.com>",
				to: assignment.giverEmail,
				subject: `🎅 Secret Santa Assignment - ${room.name}`,
				html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #dc2626;">🎅 Secret Santa Assignment</h1>
            <p>Hi ${assignment.giverName},</p>
            <p>The names have been drawn for <strong>${room.name}</strong>!</p>
            <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h2 style="margin-top: 0; color: #059669;">You are Secret Santa for:</h2>
              <p style="font-size: 24px; font-weight: bold; color: #1f2937; margin: 10px 0;">
                ${assignment.receiverName}
              </p>
              ${giftPreferences ? `<div style="padding: 15px; background-color: white; border-radius: 5px;">${giftPreferences.replace(/\n/g, "")}</div>` : ""}
            </div>
            <p style="color: #6b7280; font-size: 14px;">
              Remember: Keep it a secret! 🤫
            </p>
          </div>
        `,
			};
		});

		// batch email payloads into groups of 2 and wait one sec between each group
		for (let i = 0; i < emailPayloads.length; i += 2) {
			const batch = emailPayloads.slice(i, i + 2);
			const results = await Promise.all(
				batch.map(async (payload) => {
					return await resend.emails.send(payload);
				}),
			);
			console.log("email results", results);
			await new Promise((resolve) => setTimeout(resolve, 1000));
		}

		return {
			success: true,
			message: "Names drawn successfully and emails sent!",
			participantCount: assignments.length,
		};
	});
