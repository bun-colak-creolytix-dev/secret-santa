import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core'
import { sql } from 'drizzle-orm'

export const rooms = sqliteTable('rooms', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  organizerEmail: text('organizer_email').notNull(),
  isDrawn: integer('is_drawn', { mode: 'boolean' }).notNull().default(false),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(
    sql`(unixepoch())`,
  ),
})

export const participants = sqliteTable('participants', {
  id: integer('id', { mode: 'number' }).primaryKey({
    autoIncrement: true,
  }),
  roomId: text('room_id')
    .notNull()
    .references(() => rooms.id),
  name: text('name').notNull(),
  email: text('email').notNull(),
  note: text('note'),
  assignedToId: integer('assigned_to_id').references(
    (): any => participants.id,
  ),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(
    sql`(unixepoch())`,
  ),
})
