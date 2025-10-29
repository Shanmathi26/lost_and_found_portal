-- Modify chat_messages table to allow NULL receiver_username for broadcast messages
ALTER TABLE chat_messages MODIFY COLUMN receiver_username VARCHAR(255) NULL;