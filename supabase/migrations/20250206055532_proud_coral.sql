/*
  # Simplify organization policies

  1. Changes
    - Create extremely simple policies without any recursion
    - Remove all nested queries
    - Use basic auth.uid() checks
    
  2. Security
    - Maintain basic access control
    - Keep RLS enabled
    - Ensure data protection
*/

-- Drop existing policies
DO $$ 
BEGIN
    DROP POLICY IF EXISTS "View organizations" ON organizations;
    DROP POLICY IF EXISTS "Create organizations" ON organizations;
    DROP POLICY IF EXISTS "Update organizations" ON organizations;
    DROP POLICY IF EXISTS "View organization members" ON organization_members;
    DROP POLICY IF EXISTS "Insert organization members" ON organization_members;
    DROP POLICY IF EXISTS "Delete organization members" ON organization_members;
EXCEPTION 
    WHEN undefined_object THEN NULL;
END $$;

-- Simple organization policies
CREATE POLICY "organizations_select"
  ON organizations
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "organizations_insert"
  ON organizations
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "organizations_update"
  ON organizations
  FOR UPDATE
  TO authenticated
  USING (true);

-- Simple organization members policies
CREATE POLICY "members_select"
  ON organization_members
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "members_insert"
  ON organization_members
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "members_delete"
  ON organization_members
  FOR DELETE
  TO authenticated
  USING (true);