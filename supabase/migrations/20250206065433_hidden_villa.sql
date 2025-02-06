/*
  # Create Test Organization and Seed Data

  1. Changes
    - Creates a test organization with a proper UUID
    - Seeds sample calls for the test organization
    - Adds associated transcripts, documents, and notes

  2. Data Structure
    - Test organization with fixed UUID
    - Sample calls with various statuses
    - Associated data (transcripts, documents, notes)
*/

-- Create test organization
INSERT INTO organizations (id, name)
VALUES (
  '00000000-0000-4000-8000-000000000000',
  'Test Organization'
)
ON CONFLICT (id) DO NOTHING;

-- Insert sample calls for test organization
INSERT INTO calls (
  organization_id,
  customer_name,
  customer_email,
  customer_phone,
  status,
  subject,
  summary,
  duration,
  loan_type,
  loan_amount,
  credit_score,
  annual_income
)
VALUES
  (
    '00000000-0000-4000-8000-000000000000',
    'Sarah Johnson',
    'sarah.j@example.com',
    '(555) 123-4567',
    'new',
    'First Home Buyer Inquiry',
    'First-time homebuyer seeking information about mortgage options. Has 20% down payment saved and stable employment history.',
    '25 minutes'::interval,
    'mortgage',
    450000,
    720,
    95000
  ),
  (
    '00000000-0000-4000-8000-000000000000',
    'Michael Chen',
    'michael.c@example.com',
    '(555) 234-5678',
    'flagged',
    'Business Expansion Loan Discussion',
    'Owner of local restaurant chain seeking funding for expansion. Strong financials but complex business structure.',
    '45 minutes'::interval,
    'business',
    750000,
    680,
    250000
  ),
  (
    '00000000-0000-4000-8000-000000000000',
    'Emily Rodriguez',
    'emily.r@example.com',
    '(555) 345-6789',
    'reviewed',
    'Home Refinance Consultation',
    'Looking to refinance existing mortgage to take advantage of lower rates. Property has appreciated significantly.',
    '35 minutes'::interval,
    'mortgage',
    320000,
    755,
    88000
  );

-- Insert transcripts for each call
INSERT INTO call_transcripts (call_id, transcript)
SELECT 
  id as call_id,
  CASE 
    WHEN customer_name = 'Sarah Johnson' THEN
      'Agent: Thank you for calling. How can I help you today?\n\n' ||
      'Sarah: Hi, I''m interested in buying my first home and need information about mortgages.\n\n' ||
      'Agent: I''d be happy to help. Can you tell me about your situation?\n\n' ||
      'Sarah: Sure, I''ve saved up 20% for a down payment on a home around $450,000. I''ve been at my job for 5 years...'
    WHEN customer_name = 'Michael Chen' THEN
      'Agent: Good morning, how can I assist you?\n\n' ||
      'Michael: Hello, I''m looking to expand my restaurant business and need funding.\n\n' ||
      'Agent: I''d be happy to discuss business loan options. Tell me about your expansion plans.\n\n' ||
      'Michael: We currently have three locations and want to open two more...'
    ELSE
      'Agent: Hello, how can I help you today?\n\n' ||
      'Emily: Hi, I''m interested in refinancing my home loan.\n\n' ||
      'Agent: I can definitely help with that. How long have you had your current mortgage?\n\n' ||
      'Emily: About 5 years now, and I''ve noticed rates are much lower...'
  END
FROM calls
WHERE organization_id = '00000000-0000-4000-8000-000000000000';

-- Insert documents for each call
INSERT INTO call_documents (call_id, name, status, required, url)
SELECT 
  c.id as call_id,
  d.name,
  d.status,
  d.required,
  d.url
FROM calls c
CROSS JOIN (
  VALUES 
    ('Pay Stubs', 'received', true, 'https://example.com/docs/paystubs.pdf'),
    ('Bank Statements', 'pending', true, null),
    ('Tax Returns', 'pending', true, null),
    ('ID Verification', 'received', true, 'https://example.com/docs/id.pdf')
) as d(name, status, required, url)
WHERE c.organization_id = '00000000-0000-4000-8000-000000000000';

-- Create a test admin user for the organization if they don't exist
INSERT INTO organization_members (
  organization_id,
  user_id,
  role
)
SELECT 
  '00000000-0000-4000-8000-000000000000',
  id,
  'admin'
FROM auth.users
WHERE email = 'test@example.com'
ON CONFLICT (organization_id, user_id) DO NOTHING;

-- Insert notes for each call
INSERT INTO call_notes (call_id, user_id, content)
SELECT 
  c.id as call_id,
  m.user_id,
  CASE 
    WHEN c.customer_name = 'Sarah Johnson' THEN 'First-time buyer with excellent preparation. Pre-approval recommended.'
    WHEN c.customer_name = 'Michael Chen' THEN 'Complex business structure requires additional review. Flag for senior underwriter.'
    ELSE 'Good refinance candidate. Property in high-appreciation area.'
  END as content
FROM calls c
JOIN organization_members m ON c.organization_id = m.organization_id
WHERE c.organization_id = '00000000-0000-4000-8000-000000000000'
  AND m.role = 'admin';