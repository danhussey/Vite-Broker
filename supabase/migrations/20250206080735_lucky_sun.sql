-- Create deployments table
CREATE TABLE IF NOT EXISTS deployments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  status text NOT NULL CHECK (status IN ('in_progress', 'completed', 'failed')),
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE deployments ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "deployments_select_policy"
  ON deployments
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "deployments_insert_policy"
  ON deployments
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "deployments_update_policy"
  ON deployments
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_deployments_status ON deployments(status);
CREATE INDEX IF NOT EXISTS idx_deployments_created_at ON deployments(created_at);