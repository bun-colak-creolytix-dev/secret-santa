-- First add columns as nullable
ALTER TABLE `rooms` ADD `organizer_name` text;
ALTER TABLE `rooms` ADD `admin_key` text;

-- Update existing rows with default values
UPDATE `rooms` SET `organizer_name` = 'Admin' WHERE `organizer_name` IS NULL;
UPDATE `rooms` SET `admin_key` = 'temp_' || `id` WHERE `admin_key` IS NULL;
