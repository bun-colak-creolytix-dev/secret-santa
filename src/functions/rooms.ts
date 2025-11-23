import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { nanoid } from 'nanoid'
import { db } from '@/db'
import { rooms } from '@/db/schema'

// Input validation schema
const createRoomSchema = z.object({
  name: z.string().min(3, 'Room name must be at least 3 characters'),
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

    // Generate a unique room ID
    const roomId = nanoid(10)

    // Insert the room into the database
    const [newRoom] = await db
      .insert(rooms)
      .values({
        id: roomId,
        name: validated.name,
        organizerEmail: validated.organizerEmail,
      })
      .returning()

    return {
      id: newRoom.id,
      name: newRoom.name,
      organizerEmail: newRoom.organizerEmail,
    }
  },
)

