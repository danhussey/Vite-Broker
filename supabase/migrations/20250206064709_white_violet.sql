/*
  # Call System Tables and Policies

  1. Tables
    - Adds tables for calls, transcripts, documents, and notes
    - All tables have proper foreign key relationships
    - Includes necessary constraints and indexes
  
  2. Security
    - Enables RLS on all tables
    - Adds policies for organization-based access control
    - Ensures users can only access data within their organization
*/

-- Drop existing policies if they exist
DO $$ 
DECLARE
  pol record;
BEGIN
  FOR pol IN (
    SELECT policyname, tablename 
    FROM pg_policies 
    WHERE schemaname = 'public'
    AND tablename IN ('calls', 'call_transcripts', 'call_documents', 'call_notes')
  )
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON %I', pol.policyname, pol.tablename);
  END LOOP;
END $$;

-- Create calls table if it doesn't exist
DO $$ 
BEGIN
  CREATE TABLE IF NOT EXISTS calls (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id uuid NOT NULL REFERENCES organizations(id),
    customer_name text NOT NULL,
    customer_email text,
    customer_phone text,
    status text NOT NULL CHECK (status IN ('new', 'reviewed', 'flagged')),
    subject text NOT NULL,
    summary text,
    duration interval,
    loan_type text NOT NULL CHECK (loan_type IN ('mortgage', 'personal', 'business', 'auto')),
    loan_amount decimal,
    credit_score integer,
    annual_income decimal,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
  );
EXCEPTION
  WHEN duplicate_table THEN NULL;
END $$;

-- Create call transcripts table if it doesn't exist
DO $$ 
BEGIN
  CREATE TABLE IF NOT EXISTS call_transcripts (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    call_id uuid NOT NULL REFERENCES calls(id) ON DELETE CASCADE,
    transcript text NOT NULL,
    created_at timestamptz DEFAULT now()
  );
EXCEPTION
  WHEN duplicate_table THEN NULL;
END $$;

-- Create call documents table if it doesn't exist
DO $$ 
BEGIN
  CREATE TABLE IF NOT EXISTS call_documents (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    call_id uuid NOT NULL REFERENCES calls(id) ON DELETE CASCADE,
    name text NOT NULL,
    status text NOT NULL CHECK (status IN ('pending', 'received', 'rejected')),
    required boolean DEFAULT false,
    url text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
  );
EXCEPTION
  WHEN duplicate_table THEN NULL;
END $$;

-- Create call notes table if it doesn't exist
DO $$ 
BEGIN
  CREATE TABLE IF NOT EXISTS call_notes (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    call_id uuid NOT NULL REFERENCES calls(id) ON DELETE CASCADE,
    user_id uuid NOT NULL REFERENCES auth.users(id),
    content text NOT NULL,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
  );
EXCEPTION
  WHEN duplicate_table THEN NULL;
END $$;

-- Enable RLS
DO $$ 
BEGIN
  ALTER TABLE calls ENABLE ROW LEVEL SECURITY;
  ALTER TABLE call_transcripts ENABLE ROW LEVEL SECURITY;
  ALTER TABLE call_documents ENABLE ROW LEVEL SECURITY;
  ALTER TABLE call_notes ENABLE ROW LEVEL SECURITY;
EXCEPTION
  WHEN undefined_object THEN NULL;
END $$;

-- Create new policies
DO $$ 
BEGIN
  -- Calls policies
  CREATE POLICY "organization_calls_select"
    ON calls
    FOR SELECT
    TO authenticated
    USING (
      organization_id IN (
        SELECT organization_id 
        FROM organization_members 
        WHERE user_id = auth.uid()
      )
    );

  -- Call transcripts policies
  CREATE POLICY "organization_transcripts_select"
    ON call_transcripts
    FOR SELECT
    TO authenticated
    USING (
      call_id IN (
        SELECT id 
        FROM calls 
        WHERE organization_id IN (
          SELECT organization_id 
          FROM organization_members 
          WHERE user_id = auth.uid()
        )
      )
    );

  -- Call documents policies
  CREATE POLICY "organization_documents_select"
    ON call_documents
    FOR SELECT
    TO authenticated
    USING (
      call_id IN (
        SELECT id 
        FROM calls 
        WHERE organization_id IN (
          SELECT organization_id 
          FROM organization_members 
          WHERE user_id = auth.uid()
        )
      )
    );

  -- Call notes policies
  CREATE POLICY "organization_notes_select"
    ON call_notes
    FOR SELECT
    TO authenticated
    USING (
      call_id IN (
        SELECT id 
        FROM calls 
        WHERE organization_id IN (
          SELECT organization_id 
          FROM organization_members 
          WHERE user_id = auth.uid()
        )
      )
    );
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Create indexes if they don't exist
DO $$ 
BEGIN
  CREATE INDEX IF NOT EXISTS idx_calls_organization_id ON calls(organization_id);
  CREATE INDEX IF NOT EXISTS idx_call_transcripts_call_id ON call_transcripts(call_id);
  CREATE INDEX IF NOT EXISTS idx_call_documents_call_id ON call_documents(call_id);
  CREATE INDEX IF NOT EXISTS idx_call_notes_call_id ON call_notes(call_id);
  CREATE INDEX IF NOT EXISTS idx_call_notes_user_id ON call_notes(user_id);
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;
