/*
  # Fix organization policies

  1. Changes
    - Drop all existing policies safely
    - Recreate policies with proper checks
    - Enable RLS on all tables
  
  2. Security
    - Profiles: Users can only access their own profile
    - Organizations: Users can view organizations they belong to and create new ones
    - Organization Members: Users can view their own memberships and those in their organizations
*/

-- Drop ALL existing policies first
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

-- Profiles policies
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'profiles' AND policyname = 'allow_select_own_profile'
  ) THEN
    CREATE POLICY "allow_select_own_profile"
      ON profiles
      FOR SELECT
      TO authenticated
      USING (auth.uid() = id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'profiles' AND policyname = 'allow_update_own_profile'
  ) THEN
    CREATE POLICY "allow_update_own_profile"
      ON profiles
      FOR UPDATE
      TO authenticated
      USING (auth.uid() = id)
      WITH CHECK (auth.uid() = id);
  END IF;
END $$;

-- Organizations policies
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'organizations' AND policyname = 'allow_select_member_orgs'
  ) THEN
    CREATE POLICY "allow_select_member_orgs"
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
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'organizations' AND policyname = 'allow_insert_orgs'
  ) THEN
    CREATE POLICY "allow_insert_orgs"
      ON organizations
      FOR INSERT
      TO authenticated
      WITH CHECK (true);
  END IF;
END $$;

-- Organization members policies
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'organization_members' AND policyname = 'allow_select_org_members'
  ) THEN
    CREATE POLICY "allow_select_org_members"
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
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'organization_members' AND policyname = 'allow_insert_org_members'
  ) THEN
    CREATE POLICY "allow_insert_org_members"
      ON organization_members
      FOR INSERT
      TO authenticated
      WITH CHECK (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'organization_members' AND policyname = 'allow_update_org_members'
  ) THEN
    CREATE POLICY "allow_update_org_members"
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
  END IF;
END $$;
