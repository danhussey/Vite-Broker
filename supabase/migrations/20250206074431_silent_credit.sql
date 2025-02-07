-- Create RetellAI agent configuration table
CREATE TABLE IF NOT EXISTS retell_agent_configs (
  organization_id uuid PRIMARY KEY REFERENCES organizations(id) ON DELETE CASCADE,
  agent_id text,
  voice_id text,
  llm_id text,
  ambient_sound text,
  language text DEFAULT 'en-US',
  status text NOT NULL CHECK (status IN ('inactive', 'deploying', 'active', 'error')) DEFAULT 'inactive',
  error_message text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE retell_agent_configs ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "organization_members_select_agent_config"
  ON retell_agent_configs
  FOR SELECT
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id 
      FROM organization_members 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "organization_admins_manage_agent_config"
  ON retell_agent_configs
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

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_retell_agent_configs_status ON retell_agent_configs(status);
