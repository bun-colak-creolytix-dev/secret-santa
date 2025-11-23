CREATE TABLE `participants` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`room_id` text NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`note` text,
	`assigned_to_id` integer,
	`created_at` integer DEFAULT (unixepoch()),
	FOREIGN KEY (`room_id`) REFERENCES `rooms`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`assigned_to_id`) REFERENCES `participants`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `rooms` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`organizer_email` text NOT NULL,
	`is_drawn` integer DEFAULT false NOT NULL,
	`created_at` integer DEFAULT (unixepoch())
);
