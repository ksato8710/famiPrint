
-- Add unique constraint to filename column in prints table
ALTER TABLE prints
ADD CONSTRAINT unique_filename UNIQUE (filename);
