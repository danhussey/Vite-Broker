-- Drop existing policies if they exist
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "organization_members_select_retell" ON retell_configurations;
  DROP POLICY IF EXISTS "organization_admins_manage_retell" ON retell_configurations;
EXCEPTION
  WHEN undefined_object THEN NULL;
END $$;

-- Create RetellAI configurations table if it doesn't exist
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

-- Create new policies with unique names
CREATE POLICY "retell_config_select_policy"
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

CREATE POLICY "retell_config_manage_policy"
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

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_retell_configurations_status ON retell_configurations(status);