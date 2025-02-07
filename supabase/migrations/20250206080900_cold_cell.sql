-- Drop existing deployments table if it exists
DROP TABLE IF EXISTS deployments CASCADE;

-- Create deployments table
CREATE TABLE deployments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  status text NOT NULL CHECK (status IN ('in_progress', 'completed', 'failed')),
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE deployments ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "deployments_select"
  ON deployments
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "deployments_insert"
  ON deployments
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "deployments_update"
  ON deployments
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create indexes
CREATE INDEX idx_deployments_status ON deployments(status);
CREATE INDEX idx_deployments_created_at ON deployments(created_at);

-- Create or replace the apply_migrations function
CREATE OR REPLACE FUNCTION apply_migrations()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Your migration logic here
  -- This is a placeholder that succeeds without doing anything
  RETURN;
END;
$$;
