
-- Disable RLS for prints table and allow all operations
ALTER TABLE prints DISABLE ROW LEVEL SECURITY;

-- Drop all existing policies for prints table
DROP POLICY IF EXISTS "Allow public read access" ON prints;
DROP POLICY IF EXISTS "Allow insert for authenticated users" ON prints;
DROP POLICY IF EXISTS "Allow update for owner" ON prints;
DROP POLICY IF EXISTS "Allow delete for owner" ON prints;

-- Re-enable RLS (optional, but good practice if you want to add new policies later)
-- ALTER TABLE prints ENABLE ROW LEVEL SECURITY;

-- Create new policies to allow all operations for all users (public access)
CREATE POLICY "Allow all access for all users" ON prints
  FOR ALL USING (true) WITH CHECK (true);


-- Disable RLS for storage.objects and allow all operations
-- Note: Supabase Storage RLS is managed differently. We will focus on the bucket policies.

-- Drop all existing policies for storage.objects on 'prints' bucket
DROP POLICY IF EXISTS "Allow public read access on prints bucket" ON storage.objects;
DROP POLICY IF EXISTS "Allow insert for authenticated users on prints bucket" ON storage.objects;
DROP POLICY IF EXISTS "Allow update for owner on prints bucket" ON storage.objects;
DROP POLICY IF EXISTS "Allow delete for owner on prints bucket" ON storage.objects;

-- Create new policies to allow all operations for all users on 'prints' bucket
CREATE POLICY "Allow all access for all users on prints bucket" ON storage.objects
  FOR ALL USING (bucket_id = 'prints');
