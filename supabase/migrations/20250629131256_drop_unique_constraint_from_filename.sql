
-- Drop unique constraint from filename column in prints table
ALTER TABLE prints
DROP CONSTRAINT IF EXISTS unique_filename;
