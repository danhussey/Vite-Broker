-- Drop existing policies
DO $$ 
BEGIN
    DROP POLICY IF EXISTS "profiles_select" ON profiles;
    DROP POLICY IF EXISTS "profiles_update" ON profiles;
    DROP POLICY IF EXISTS "organizations_select" ON organizations;
    DROP POLICY IF EXISTS "organizations_insert" ON organizations;
    DROP POLICY IF EXISTS "organization_members_select" ON organization_members;
    DROP POLICY IF EXISTS "organization_members_insert" ON organization_members;
    DROP POLICY IF EXISTS "organization_members_update" ON organization_members;
EXCEPTION 
    WHEN undefined_object THEN NULL;
END $$;

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_members ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "profiles_select"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "profiles_update"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Organizations policies
CREATE POLICY "organizations_select"
  ON organizations
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM organization_members
      WHERE organization_id = id
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "organizations_insert"
  ON organizations
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Organization members policies
CREATE POLICY "organization_members_select"
  ON organization_members
  FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid() OR
    organization_id IN (
      SELECT organization_id FROM organization_members
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "organization_members_insert"
  ON organization_members
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "organization_members_update"
  ON organization_members
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM organization_members
      WHERE organization_id = organization_members.organization_id
      AND user_id = auth.uid()
      AND role = 'admin'
    )
  );
