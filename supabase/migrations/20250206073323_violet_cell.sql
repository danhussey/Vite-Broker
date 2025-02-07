/*
  # RetellAI Configuration Schema

  1. New Tables
    - `retell_configurations`
      - `organization_id` (uuid, primary key) - References the organization
      - `webhook_url` (text) - Webhook URL for call events
      - `phone_number` (text) - Assigned phone number
      - `status` (text) - Current deployment status
      - `created_at` (timestamptz) - Creation timestamp
      - `updated_at` (timestamptz) - Last update timestamp

  2. Security
    - Enable RLS on `retell_configurations` table
    - Add policies for organization admins to manage their configurations
*/

-- Create RetellAI configurations table
CREATE TABLE IF NOT EXISTS retell_configurations (
  organization_id uuid PRIMARY KEY REFERENCES organizations(id) ON DELETE CASCADE,
  webhook_url text,
  phone_number text,
  status text NOT NULL CHECK (status IN ('inactive', 'deploying', 'active', 'error')) DEFAULT 'inactive',
  error_message text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE retell_configurations ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "organization_members_select_retell"
  ON retell_configurations
  FOR SELECT
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id 
      FROM organization_members 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "organization_admins_manage_retell"
  ON retell_configurations
  FOR ALL
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id 
      FROM organization_members 
      WHERE user_id = auth.uid()
      AND role = 'admin'
    )
  )
  WITH CHECK (
    organization_id IN (
      SELECT organization_id 
      FROM organization_members 
      WHERE user_id = auth.uid()
      AND role = 'admin'
    )
  );
