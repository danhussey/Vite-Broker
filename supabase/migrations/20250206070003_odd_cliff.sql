/*
  # Seed Customer Data

  1. Changes
    - Insert sample customers for test organization
    - Add credit check history
*/

-- Insert sample customers
INSERT INTO customers (
  organization_id,
  full_name,
  email,
  phone,
  address,
  status,
  credit_score,
  total_loans,
  active_loans,
  profile_image,
  tags,
  last_contact
)
SELECT
  o.id as organization_id,
  c.full_name,
  c.email,
  c.phone,
  c.address,
  c.status,
  c.credit_score,
  c.total_loans,
  c.active_loans,
  c.profile_image,
  c.tags,
  c.last_contact
FROM organizations o
CROSS JOIN (
  VALUES
    (
      'Sarah Johnson',
      'sarah.johnson@email.com',
      '(555) 123-4567',
      '42 Wallaby Way, Sydney NSW 2000',
      'active',
      745,
      2,
      1,
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
      ARRAY['mortgage', 'reliable-payer']::text[],
      NOW() - interval '1 day'
    ),
    (
      'Michael Chen',
      'michael.chen@email.com',
      '(555) 987-6543',
      '15 Market Street, Melbourne VIC 3000',
      'active',
      NULL,
      1,
      1,
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
      ARRAY['new-customer']::text[],
      NOW()
    ),
    (
      'Emily Rodriguez',
      'emily.r@email.com',
      '(555) 456-7890',
      '78 Adelaide Street, Brisbane QLD 4000',
      'pending',
      NULL,
      0,
      0,
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80',
      ARRAY['pending-approval']::text[],
      NOW() - interval '2 days'
    )
) as c(
  full_name,
  email,
  phone,
  address,
  status,
  credit_score,
  total_loans,
  active_loans,
  profile_image,
  tags,
  last_contact
);

-- Insert credit checks for customers
INSERT INTO credit_checks (
  customer_id,
  status,
  provider,
  request_date,
  completed_date,
  score,
  report,
  error
)
SELECT
  c.id as customer_id,
  CASE 
    WHEN c.full_name = 'Sarah Johnson' THEN 'completed'
    WHEN c.full_name = 'Michael Chen' THEN 'in_progress'
    ELSE 'pending'
  END as status,
  'Equifax' as provider,
  NOW() - interval '1 day' as request_date,
  CASE 
    WHEN c.full_name = 'Sarah Johnson' THEN NOW() - interval '23 hours'
    ELSE NULL
  END as completed_date,
  CASE 
    WHEN c.full_name = 'Sarah Johnson' THEN 745
    ELSE NULL
  END as score,
  CASE 
    WHEN c.full_name = 'Sarah Johnson' THEN jsonb_build_object(
      'summary', 'Excellent credit history with consistent payment record',
      'defaultHistory', false,
      'bankruptcyHistory', false,
      'creditUtilization', 15,
      'paymentHistory', jsonb_build_object(
        'onTime', 98,
        'late', 2,
        'missed', 0
      ),
      'inquiries', 2,
      'accountAges', jsonb_build_object(
        'oldest', 8,
        'average', 4.5
      )
    )
    ELSE NULL
  END as report,
  NULL as error
FROM customers c;