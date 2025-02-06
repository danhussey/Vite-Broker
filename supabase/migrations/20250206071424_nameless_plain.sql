-- Drop existing document comments policies
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "comments_select_policy" ON document_comments;
  DROP POLICY IF EXISTS "comments_insert_policy" ON document_comments;
  DROP POLICY IF EXISTS "comments_update_policy" ON document_comments;
EXCEPTION
  WHEN undefined_object THEN NULL;
END $$;

-- Create new document comments policies
CREATE POLICY "comments_select_policy"
  ON document_comments
  FOR SELECT
  TO authenticated
  USING (
    document_id IN (
      SELECT id 
      FROM documents 
      WHERE organization_id IN (
        SELECT organization_id 
        FROM organization_members 
        WHERE user_id = auth.uid()
      )
    )
  );

CREATE POLICY "comments_insert_policy"
  ON document_comments
  FOR INSERT
  TO authenticated
  WITH CHECK (
    document_id IN (
      SELECT id 
      FROM documents 
      WHERE organization_id IN (
        SELECT organization_id 
        FROM organization_members 
        WHERE user_id = auth.uid()
      )
    )
  );

CREATE POLICY "comments_update_policy"
  ON document_comments
  FOR UPDATE
  TO authenticated
  USING (
    user_id = auth.uid() AND
    document_id IN (
      SELECT id 
      FROM documents 
      WHERE organization_id IN (
        SELECT organization_id 
        FROM organization_members 
        WHERE user_id = auth.uid()
      )
    )
  )
  WITH CHECK (
    user_id = auth.uid() AND
    document_id IN (
      SELECT id 
      FROM documents 
      WHERE organization_id IN (
        SELECT organization_id 
        FROM organization_members 
        WHERE user_id = auth.uid()
      )
    )
  );