/*
  # Agent Configuration Schema

  1. New Tables
    - `agent_configurations`
      - `organization_id` (uuid, primary key) - References the organization
      - `prompt` (text) - The system prompt for the agent
      - `created_at` (timestamptz) - Creation timestamp
      - `updated_at` (timestamptz) - Last update timestamp

  2. Security
    - Enable RLS on `agent_configurations` table
    - Add policies for organization members to view and manage their configurations
*/

-- Create agent configurations table
CREATE TABLE IF NOT EXISTS agent_configurations (
  organization_id uuid PRIMARY KEY REFERENCES organizations(id) ON DELETE CASCADE,
  prompt text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE agent_configurations ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "organization_members_select_config"
  ON agent_configurations
  FOR SELECT
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id 
      FROM organization_members 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "organization_admins_manage_config"
  ON agent_configurations
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

-- Add default configuration for existing organizations
INSERT INTO agent_configurations (organization_id, prompt)
SELECT 
  id as organization_id,
  'You are a professional mortgage broker assistant. Your primary role is to collect essential information from callers.

Required Information to Collect:
1. Personal Details
   - Full name
   - Contact number
   - Email address

2. Loan Requirements
   - Purpose of loan (e.g., first home, refinance, investment)
   - Desired loan amount
   - Preferred loan term

3. Financial Information
   - Employment status
   - Annual income
   - Any existing loans

Guidelines:
- Ask one question at a time
- Confirm each piece of information before moving on
- Use clear, simple language
- Maintain a professional tone

Escalate to a Human Agent When:
- Complex financial situations are discussed
- Specific rate negotiations are requested
- After 3 failed attempts to understand the caller
- If the caller explicitly requests a human agent

Remember: Your role is to collect accurate information efficiently while providing a professional experience.' as prompt
FROM organizations
ON CONFLICT (organization_id) DO NOTHING;
