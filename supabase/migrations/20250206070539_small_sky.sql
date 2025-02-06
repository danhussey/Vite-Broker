/*
  # Document Management System Setup

  1. New Tables
    - `documents`
      - Core document metadata and status
    - `document_versions`
      - Version history for documents
    - `document_shares`
      - Sharing and access control
    - `document_comments`
      - User comments on documents

  2. Security
    - RLS enabled on all tables
    - Policies for organization-based access
*/

-- Create documents table
CREATE TABLE IF NOT EXISTS documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id),
  customer_id uuid REFERENCES customers(id),
  name text NOT NULL,
  type text NOT NULL,
  status text NOT NULL CHECK (status IN ('pending_upload', 'uploaded', 'processing', 'verified', 'rejected', 'expired')),
  ai_verification_status text CHECK (ai_verification_status IN ('pending', 'success', 'failed', 'needs_review')),
  required boolean DEFAULT false,
  expiry_date timestamptz,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create document versions table
CREATE TABLE IF NOT EXISTS document_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id uuid NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
  version_number integer NOT NULL,
  file_url text NOT NULL,
  file_type text NOT NULL,
  file_size integer,
  uploaded_by uuid REFERENCES auth.users(id),
  uploaded_at timestamptz DEFAULT now()
);

-- Create document shares table
CREATE TABLE IF NOT EXISTS document_shares (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id uuid NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
  shared_with uuid REFERENCES auth.users(id),
  shared_by uuid REFERENCES auth.users(id),
  access_level text NOT NULL CHECK (access_level IN ('view', 'comment', 'edit')),
  expires_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Create document comments table
CREATE TABLE IF NOT EXISTS document_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id uuid NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id),
  content text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_shares ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_comments ENABLE ROW LEVEL SECURITY;

-- Documents policies
CREATE POLICY "organization_documents_select"
  ON documents
  FOR SELECT
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id 
      FROM organization_members 
      WHERE user_id = auth.uid()
    )
  );

-- Document versions policies
CREATE POLICY "organization_versions_select"
  ON document_versions
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

-- Document shares policies
CREATE POLICY "organization_shares_select"
  ON document_shares
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

-- Document comments policies
CREATE POLICY "organization_comments_select"
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

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_documents_organization_id ON documents(organization_id);
CREATE INDEX IF NOT EXISTS idx_documents_customer_id ON documents(customer_id);
CREATE INDEX IF NOT EXISTS idx_documents_status ON documents(status);
CREATE INDEX IF NOT EXISTS idx_document_versions_document_id ON document_versions(document_id);
CREATE INDEX IF NOT EXISTS idx_document_shares_document_id ON document_shares(document_id);
CREATE INDEX IF NOT EXISTS idx_document_comments_document_id ON document_comments(document_id);