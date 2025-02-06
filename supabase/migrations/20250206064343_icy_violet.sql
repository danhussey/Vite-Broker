/*
  # Add Call Management Tables

  1. New Tables
    - `calls`
      - Core call data including customer info, loan details
      - Organization-scoped through organization_id
    - `call_transcripts`
      - Stores call transcripts
      - One-to-one relationship with calls
    - `call_documents`
      - Tracks required/optional documents for each call
      - Many-to-one relationship with calls
    - `call_notes`
      - Team collaboration notes on calls
      - Many-to-one relationship with calls

  2. Security
    - Enable RLS on all tables
    - Add policies for organization-based access
    - Ensure users can only access data within their organization
*/

-- Create calls table
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

-- Create call transcripts table
CREATE TABLE IF NOT EXISTS call_transcripts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  call_id uuid NOT NULL REFERENCES calls(id) ON DELETE CASCADE,
  transcript text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create call documents table
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

-- Create call notes table
CREATE TABLE IF NOT EXISTS call_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  call_id uuid NOT NULL REFERENCES calls(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id),
  content text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE calls ENABLE ROW LEVEL SECURITY;
ALTER TABLE call_transcripts ENABLE ROW LEVEL SECURITY;
ALTER TABLE call_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE call_notes ENABLE ROW LEVEL SECURITY;

-- Calls policies
CREATE POLICY "calls_select_policy"
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
CREATE POLICY "call_transcripts_select_policy"
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
CREATE POLICY "call_documents_select_policy"
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
CREATE POLICY "call_notes_select_policy"
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

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_calls_organization_id ON calls(organization_id);
CREATE INDEX IF NOT EXISTS idx_call_transcripts_call_id ON call_transcripts(call_id);
CREATE INDEX IF NOT EXISTS idx_call_documents_call_id ON call_documents(call_id);
CREATE INDEX IF NOT EXISTS idx_call_notes_call_id ON call_notes(call_id);