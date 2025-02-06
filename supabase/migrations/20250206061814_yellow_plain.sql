-- Drop existing policies if they exist
DO $$ 
BEGIN
    DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
    DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
    DROP POLICY IF EXISTS "Users can view organizations they belong to" ON organizations;
    DROP POLICY IF EXISTS "Users can view organization members" ON organization_members;
EXCEPTION 
    WHEN undefined_object THEN NULL;
END $$;

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_members ENABLE ROW LEVEL SECURITY;

-- ================================
-- Profiles policies
-- ================================

-- Allow users to read their own profile
CREATE POLICY "profiles_select_policy"
  ON profiles
  FOR SELECT
  TO authenticated
  USING ( auth.uid() = id );

-- Allow users to update their own profile
CREATE POLICY "profiles_update_policy"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING ( auth.uid() = id )
  WITH CHECK ( auth.uid() = id );

-- ================================
-- Organizations policies
-- ================================

-- Allow a user to view an organization if they belong to it
CREATE POLICY "organizations_select_policy"
  ON organizations
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 
      FROM organization_members
      WHERE organization_members.organization_id = organizations.id
        AND organization_members.user_id = auth.uid()
    )
  );

-- ================================
-- Organization members policies
-- ================================

-- Allow users to view organization members
CREATE POLICY "organization_members_select_policy"
  ON organization_members
  FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid()
    OR
    EXISTS (
      SELECT 1 
      FROM organization_members AS om
      WHERE om.organization_id = organization_members.organization_id
        AND om.user_id = auth.uid()
    )
  );