/*
  # RetellAI Integration Schema

  1. New Tables
    - `retell_calls`
      - `id` (uuid, primary key)
      - `organization_id` (uuid) - References the organization
      - `call_id` (uuid) - References the calls table
      - `retell_call_id` (text) - RetellAI's call identifier
      - `status` (text) - Call status (active, completed, failed)
      - `recording_url` (text) - URL to call recording
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `retell_transcripts`
      - `id` (uuid, primary key)
      - `retell_call_id` (uuid) - References retell_calls
      - `speaker` (text) - Who is speaking (agent/customer)
      - `content` (text) - What was said
      - `timestamp` (timestamptz)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for organization access
*/

-- Create RetellAI calls table
CREATE TABLE IF NOT EXISTS retell_calls (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id),
  call_id uuid REFERENCES calls(id),
  retell_call_id text NOT NULL,
  status text NOT NULL CHECK (status IN ('active', 'completed', 'failed')),
  recording_url text,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create RetellAI transcripts table
CREATE TABLE IF NOT EXISTS retell_transcripts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  retell_call_id uuid NOT NULL REFERENCES retell_calls(id) ON DELETE CASCADE,
  speaker text NOT NULL CHECK (speaker IN ('agent', 'customer')),
  content text NOT NULL,
  timestamp timestamptz NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE retell_calls ENABLE ROW LEVEL SECURITY;
ALTER TABLE retell_transcripts ENABLE ROW LEVEL SECURITY;

-- Create policies for retell_calls
CREATE POLICY "organization_retell_calls_select"
  ON retell_calls
  FOR SELECT
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id 
      FROM organization_members 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "organization_retell_calls_insert"
  ON retell_calls
  FOR INSERT
  TO authenticated
  WITH CHECK (
    organization_id IN (
      SELECT organization_id 
      FROM organization_members 
      WHERE user_id = auth.uid()
      AND role = 'admin'
    )
  );

-- Create policies for retell_transcripts
CREATE POLICY "organization_retell_transcripts_select"
  ON retell_transcripts
  FOR SELECT
  TO authenticated
  USING (
    retell_call_id IN (
      SELECT id 
      FROM retell_calls 
      WHERE organization_id IN (
        SELECT organization_id 
        FROM organization_members 
        WHERE user_id = auth.uid()
      )
    )
  );

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_retell_calls_organization_id ON retell_calls(organization_id);
CREATE INDEX IF NOT EXISTS idx_retell_calls_call_id ON retell_calls(call_id);
CREATE INDEX IF NOT EXISTS idx_retell_calls_retell_call_id ON retell_calls(retell_call_id);
CREATE INDEX IF NOT EXISTS idx_retell_transcripts_retell_call_id ON retell_transcripts(retell_call_id);
CREATE INDEX IF NOT EXISTS idx_retell_transcripts_timestamp ON retell_transcripts(timestamp);
