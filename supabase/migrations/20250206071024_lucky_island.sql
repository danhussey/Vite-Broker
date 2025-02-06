/*
  # Seed Documents for Loan Applications

  1. New Data
    - Sample documents for each customer
    - Document versions with file URLs
    - Document comments from staff
    - Document shares for collaboration

  2. Document Types
    - Pay stubs
    - Bank statements
    - Tax returns
    - ID verification
    - Property documents
    - Employment verification
*/

-- Insert sample documents
INSERT INTO documents (
  organization_id,
  customer_id,
  name,
  type,
  status,
  ai_verification_status,
  required,
  metadata,
  created_by
)
SELECT
  c.organization_id,
  c.id as customer_id,
  d.name,
  d.type,
  d.status,
  d.ai_status,
  d.required,
  d.metadata,
  m.user_id as created_by
FROM customers c
CROSS JOIN (
  VALUES
    (
      'Pay Stubs',
      'income_verification',
      'verified',
      'success',
      true,
      jsonb_build_object(
        'verification', jsonb_build_object(
          'verifiedBy', 'ai',
          'verifiedAt', now() - interval '2 hours',
          'score', 98,
          'issues', ARRAY[]::text[]
        )
      )
    ),
    (
      'Bank Statements',
      'financial_records',
      'processing',
      'pending',
      true,
      jsonb_build_object(
        'verification', jsonb_build_object(
          'verifiedBy', null,
          'verifiedAt', null,
          'score', null,
          'issues', null
        )
      )
    ),
    (
      'Tax Returns',
      'income_verification',
      'pending_upload',
      null,
      true,
      jsonb_build_object(
        'verification', jsonb_build_object(
          'verifiedBy', null,
          'verifiedAt', null,
          'score', null,
          'issues', null
        )
      )
    ),
    (
      'Drivers License',
      'identification',
      'verified',
      'success',
      true,
      jsonb_build_object(
        'verification', jsonb_build_object(
          'verifiedBy', 'ai',
          'verifiedAt', now() - interval '1 day',
          'score', 99,
          'issues', ARRAY[]::text[]
        )
      )
    ),
    (
      'Property Valuation',
      'property_documents',
      'rejected',
      'failed',
      true,
      jsonb_build_object(
        'verification', jsonb_build_object(
          'verifiedBy', 'ai',
          'verifiedAt', now() - interval '4 hours',
          'score', 45,
          'issues', ARRAY['Image quality too low', 'Missing key information']::text[]
        )
      )
    ),
    (
      'Employment Letter',
      'employment_verification',
      'uploaded',
      'needs_review',
      true,
      jsonb_build_object(
        'verification', jsonb_build_object(
          'verifiedBy', 'ai',
          'verifiedAt', now() - interval '1 hour',
          'score', 75,
          'issues', ARRAY['Requires manual verification of employment dates']::text[]
        )
      )
    )
) as d(name, type, status, ai_status, required, metadata)
JOIN organization_members m ON c.organization_id = m.organization_id
WHERE m.role = 'admin'
AND c.status = 'active';

-- Insert document versions only for documents with files
INSERT INTO document_versions (
  document_id,
  version_number,
  file_url,
  file_type,
  file_size,
  uploaded_by,
  uploaded_at
)
SELECT
  d.id as document_id,
  1 as version_number,
  'https://example.com/documents/' || d.id || '.pdf' as file_url,
  'application/pdf' as file_type,
  FLOOR(RANDOM() * 1000000 + 500000)::integer as file_size,
  d.created_by as uploaded_by,
  d.created_at as uploaded_at
FROM documents d
WHERE d.status IN ('verified', 'processing', 'uploaded');

-- Insert document comments
INSERT INTO document_comments (
  document_id,
  user_id,
  content
)
SELECT
  d.id as document_id,
  d.created_by as user_id,
  CASE d.status
    WHEN 'verified' THEN 'Document verified successfully. All requirements met.'
    WHEN 'processing' THEN 'Document under review. Initial checks look good.'
    WHEN 'rejected' THEN 'Document rejected due to quality issues. Please resubmit.'
    WHEN 'uploaded' THEN 'Document received. Pending verification.'
    ELSE 'Awaiting document upload.'
  END as content
FROM documents d;

-- Insert document shares (for collaboration)
INSERT INTO document_shares (
  document_id,
  shared_with,
  shared_by,
  access_level,
  expires_at
)
SELECT
  d.id as document_id,
  m2.user_id as shared_with,
  d.created_by as shared_by,
  'view' as access_level,
  NOW() + interval '30 days' as expires_at
FROM documents d
JOIN organization_members m1 ON d.created_by = m1.user_id
JOIN organization_members m2 ON m1.organization_id = m2.organization_id
WHERE m2.user_id != d.created_by
AND d.status IN ('verified', 'processing', 'uploaded');