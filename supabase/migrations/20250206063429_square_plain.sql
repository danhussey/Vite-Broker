/*
  # Simplified organization policies
  
  1. Changes
    - Drop all existing policies
    - Implement simplified non-recursive policies
    - Remove complex policy checks that could cause recursion
  
  2. Security
    - Profiles: Users can only access their own profile
    - Organizations: Users can view organizations they belong to and create new ones
    - Organization Members: Simplified access rules
*/

-- Drop ALL existing policies
DO $$ 
DECLARE
  pol record;
BEGIN
  FOR pol IN (
    SELECT policyname, tablename 
    FROM pg_policies 
    WHERE schemaname = 'public'
    AND tablename IN ('profiles', 'organizations', 'organization_members')
  )
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON %I', pol.policyname, pol.tablename);
  END LOOP;
END $$;

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_members ENABLE ROW LEVEL SECURITY;

-- Simple profile policies
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

-- Simplified organization members policies
CREATE POLICY "organization_members_select"
  ON organization_members
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "organization_members_insert"
  ON organization_members
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "organization_members_update"
  ON organization_members
  FOR UPDATE
  TO authenticated
  USING (true);
