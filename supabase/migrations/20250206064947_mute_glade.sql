/*
  # Seed Call Data

  1. Sample Data
    - Creates sample calls for testing
    - Adds associated transcripts, documents, and notes
    - Uses realistic loan scenarios and customer interactions

  2. Data Structure
    - Calls with various statuses and loan types
    - Transcripts for each call
    - Required and optional documents
    - Notes from team members
*/

-- Insert sample calls
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
SELECT
  organization_id,
  customer_data.name,
  customer_data.email,
  customer_data.phone,
  customer_data.status,
  customer_data.subject,
  customer_data.summary,
  customer_data.duration::interval,
  customer_data.loan_type,
  customer_data.loan_amount,
  customer_data.credit_score,
  customer_data.annual_income
FROM (
  SELECT 
    organization_id,
    'Sarah Johnson' as name,
    'sarah.j@example.com' as email,
    '(555) 123-4567' as phone,
    'new' as status,
    'First Home Buyer Inquiry' as subject,
    'First-time homebuyer seeking information about mortgage options. Has 20% down payment saved and stable employment history.' as summary,
    '25 minutes' as duration,
    'mortgage' as loan_type,
    450000 as loan_amount,
    720 as credit_score,
    95000 as annual_income
  FROM organization_members
  WHERE user_id = auth.uid()
  LIMIT 1
) as customer_data
ON CONFLICT DO NOTHING;

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
SELECT
  organization_id,
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
FROM organization_members
WHERE user_id = auth.uid()
LIMIT 1;

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
SELECT
  organization_id,
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
FROM organization_members
WHERE user_id = auth.uid()
LIMIT 1;

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
FROM calls;

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
) as d(name, status, required, url);

-- Insert notes for each call
INSERT INTO call_notes (call_id, user_id, content)
SELECT 
  c.id as call_id,
  auth.uid() as user_id,
  CASE 
    WHEN c.customer_name = 'Sarah Johnson' THEN 'First-time buyer with excellent preparation. Pre-approval recommended.'
    WHEN c.customer_name = 'Michael Chen' THEN 'Complex business structure requires additional review. Flag for senior underwriter.'
    ELSE 'Good refinance candidate. Property in high-appreciation area.'
  END as content
FROM calls c;
