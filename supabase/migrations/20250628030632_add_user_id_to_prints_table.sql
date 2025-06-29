-- Add user_id column to prints table
ALTER TABLE prints
ADD COLUMN user_id UUID REFERENCES auth.users(id) DEFAULT auth.uid();

-- Drop existing RLS policies for prints table
DROP POLICY IF EXISTS "Allow insert for authenticated users" ON prints;
DROP POLICY IF EXISTS "Allow update for owner" ON prints;
DROP POLICY IF EXISTS "Allow delete for owner" ON prints;

-- Create new RLS policies for prints table
-- Allow authenticated users to insert their own prints
CREATE POLICY "Allow insert for authenticated users" ON prints
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own prints
CREATE POLICY "Allow update for owner" ON prints
  FOR UPDATE USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Allow users to delete their own prints
CREATE POLICY "Allow delete for owner" ON prints
  FOR DELETE USING (auth.uid() = user_id);