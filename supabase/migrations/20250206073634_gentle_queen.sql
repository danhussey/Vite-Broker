/*
  # RetellAI Integration Setup

  1. New Tables
    - `retell_agents`
      - `id` (uuid, primary key)
      - `organization_id` (uuid) - References the organization
      - `name` (text) - Agent name
      - `voice_id` (text) - RetellAI voice identifier
      - `webhook_url` (text) - Webhook for call events
      - `status` (text) - Agent status (active, inactive)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `retell_agent_prompts`
      - `id` (uuid, primary key)
      - `agent_id` (uuid) - References retell_agents
      - `prompt_type` (text) - Type of prompt (greeting, handoff, etc.)
      - `content` (text) - Prompt content
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for organization access
*/

-- Create RetellAI agents table
CREATE TABLE IF NOT EXISTS retell_agents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id),
  name text NOT NULL,
  voice_id text NOT NULL,
  webhook_url text,
  status text NOT NULL CHECK (status IN ('active', 'inactive')) DEFAULT 'inactive',
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create RetellAI agent prompts table
CREATE TABLE IF NOT EXISTS retell_agent_prompts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id uuid NOT NULL REFERENCES retell_agents(id) ON DELETE CASCADE,
  prompt_type text NOT NULL CHECK (prompt_type IN ('greeting', 'handoff', 'fallback', 'confirmation')),
  content text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(agent_id, prompt_type)
);

-- Enable RLS
ALTER TABLE retell_agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE retell_agent_prompts ENABLE ROW LEVEL SECURITY;

-- Create policies for retell_agents
CREATE POLICY "organization_retell_agents_select"
  ON retell_agents
  FOR SELECT
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id 
      FROM organization_members 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "organization_retell_agents_insert"
  ON retell_agents
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

CREATE POLICY "organization_retell_agents_update"
  ON retell_agents
  FOR UPDATE
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

-- Create policies for retell_agent_prompts
CREATE POLICY "organization_retell_prompts_select"
  ON retell_agent_prompts
  FOR SELECT
  TO authenticated
  USING (
    agent_id IN (
      SELECT id 
      FROM retell_agents 
      WHERE organization_id IN (
        SELECT organization_id 
        FROM organization_members 
        WHERE user_id = auth.uid()
      )
    )
  );

CREATE POLICY "organization_retell_prompts_insert"
  ON retell_agent_prompts
  FOR INSERT
  TO authenticated
  WITH CHECK (
    agent_id IN (
      SELECT id 
      FROM retell_agents 
      WHERE organization_id IN (
        SELECT organization_id 
        FROM organization_members 
        WHERE user_id = auth.uid()
        AND role = 'admin'
      )
    )
  );

CREATE POLICY "organization_retell_prompts_update"
  ON retell_agent_prompts
  FOR UPDATE
  TO authenticated
  USING (
    agent_id IN (
      SELECT id 
      FROM retell_agents 
      WHERE organization_id IN (
        SELECT organization_id 
        FROM organization_members 
        WHERE user_id = auth.uid()
        AND role = 'admin'
      )
    )
  )
  WITH CHECK (
    agent_id IN (
      SELECT id 
      FROM retell_agents 
      WHERE organization_id IN (
        SELECT organization_id 
        FROM organization_members 
        WHERE user_id = auth.uid()
        AND role = 'admin'
      )
    )
  );

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_retell_agents_organization_id ON retell_agents(organization_id);
CREATE INDEX IF NOT EXISTS idx_retell_agents_status ON retell_agents(status);
CREATE INDEX IF NOT EXISTS idx_retell_agent_prompts_agent_id ON retell_agent_prompts(agent_id);
CREATE INDEX IF NOT EXISTS idx_retell_agent_prompts_type ON retell_agent_prompts(prompt_type);
