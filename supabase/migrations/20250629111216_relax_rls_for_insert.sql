
-- Drop existing RLS policy for prints table insert
DROP POLICY IF EXISTS "Allow insert for authenticated users" ON prints;

-- Create new RLS policy for prints table insert
CREATE POLICY "Allow insert for authenticated users" ON prints
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Drop existing RLS policy for storage.objects insert
DROP POLICY IF EXISTS "Allow insert for authenticated users on prints bucket" ON storage.objects;

-- Create new RLS policy for storage.objects insert
CREATE POLICY "Allow insert for authenticated users on prints bucket" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'prints' AND auth.role() = 'authenticated');
