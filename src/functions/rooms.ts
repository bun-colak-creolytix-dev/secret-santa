import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { nanoid } from 'nanoid'
import { db } from '@/db'
import { rooms, participants } from '@/db/schema'
import { eq, and } from 'drizzle-orm'

// Input validation schema
const createRoomSchema = z.object({
  name: z.string().min(3, 'Room name must be at least 3 characters'),
  organizerName: z.string().min(2, 'Name must be at least 2 characters'),
  organizerEmail: z.email('Please enter a valid email address'),
})

export type CreateRoomInput = z.infer<typeof createRoomSchema>

// Server function to create a room
export const createRoom = createServerFn({ method: 'POST' }).handler(
  async (ctx) => {
    // @ts-expect-error - TanStack Start types issue
    const data = ctx.data as CreateRoomInput

    // Validate the input
    const validated = createRoomSchema.parse(data)

    // Generate a unique room ID and admin key
    const roomId = nanoid(10)
    const adminKey = nanoid(32)

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
      .returning()

    // Auto-add the creator as a participant
    await db.insert(participants).values({
      roomId: roomId,
      name: validated.organizerName,
      email: validated.organizerEmail,
      note: null,
    })

    return {
      id: newRoom.id,
      name: newRoom.name,
      organizerName: newRoom.organizerName,
      organizerEmail: newRoom.organizerEmail,
      adminKey: newRoom.adminKey,
    }
  },
)

// Input validation schema for getting room
const getRoomSchema = z.object({
  roomId: z.string().min(1, 'Room ID is required'),
})

export type GetRoomInput = z.infer<typeof getRoomSchema>

// Server function to get room with participants
export const getRoomWithParticipants = createServerFn({ method: 'GET' }).handler(
  async (ctx) => {
    // @ts-expect-error - TanStack Start types issue
    const data = ctx.data as GetRoomInput

    // Validate the input
    const validated = getRoomSchema.parse(data)

    // Fetch the room
    const [room] = await db
      .select()
      .from(rooms)
      .where(eq(rooms.id, validated.roomId))
      .limit(1)

    if (!room) {
      throw new Error('Room not found')
    }

    // Fetch all participants for this room
    const roomParticipants = await db
      .select()
      .from(participants)
      .where(eq(participants.roomId, validated.roomId))
      .orderBy(participants.createdAt)

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
    }
  },
)

// Input validation schema for joining a room
const joinRoomSchema = z.object({
  roomId: z.string().min(1, 'Room ID is required'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.email('Please enter a valid email address'),
  note: z.string().optional(),
})

export type JoinRoomInput = z.infer<typeof joinRoomSchema>

// Server function to join a room
export const joinRoom = createServerFn({ method: 'POST' }).handler(
  async (ctx) => {
    // @ts-expect-error - TanStack Start types issue
    const data = ctx.data as JoinRoomInput

    // Validate the input
    const validated = joinRoomSchema.parse(data)

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
      .limit(1)

    if (existingParticipant) {
      throw new Error('This email has already joined this room')
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
      .returning()

    return {
      id: newParticipant.id,
      name: newParticipant.name,
      email: newParticipant.email,
      note: newParticipant.note,
    }
  },
)

// Input validation schema for admin access
const getAdminRoomSchema = z.object({
  roomId: z.string().min(1, 'Room ID is required'),
  adminKey: z.string().min(1, 'Admin key is required'),
})

export type GetAdminRoomInput = z.infer<typeof getAdminRoomSchema>

// Server function to verify admin access and get room data
export const getAdminRoom = createServerFn({ method: 'GET' }).handler(
  async (ctx) => {
    // @ts-expect-error - TanStack Start types issue
    const data = ctx.data as GetAdminRoomInput

    // Validate the input
    const validated = getAdminRoomSchema.parse(data)

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
      .limit(1)

    if (!room) {
      throw new Error('Invalid room or admin key')
    }

    // Fetch all participants for this room
    const roomParticipants = await db
      .select()
      .from(participants)
      .where(eq(participants.roomId, validated.roomId))
      .orderBy(participants.createdAt)

    return {
      room: {
        id: room.id,
        name: room.name,
        organizerName: room.organizerName,
        organizerEmail: room.organizerEmail,
        isDrawn: room.isDrawn,
      },
      participants: roomParticipants.map((p) => ({
        id: p.id,
        name: p.name,
        email: p.email,
        note: p.note,
      })),
    }
  },
)

