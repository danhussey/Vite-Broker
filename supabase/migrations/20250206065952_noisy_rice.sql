/*
  # Create Customers Schema

  1. New Tables
    - `customers`
      - Basic customer information
      - Organization relationship
      - Status tracking
      - Loan history
    - `credit_checks`
      - Credit check history
      - Status tracking
      - Report details

  2. Security
    - Enable RLS on all tables
    - Add policies for organization-based access
*/

-- Create customers table
CREATE TABLE IF NOT EXISTS customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id),
  full_name text NOT NULL,
  email text NOT NULL,
  phone text,
  address text,
  status text NOT NULL CHECK (status IN ('active', 'inactive', 'pending')),
  credit_score integer,
  total_loans integer DEFAULT 0,
  active_loans integer DEFAULT 0,
  profile_image text,
  tags text[],
  last_contact timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create credit checks table
CREATE TABLE IF NOT EXISTS credit_checks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  status text NOT NULL CHECK (status IN ('pending', 'in_progress', 'completed', 'failed')),
  provider text NOT NULL,
  request_date timestamptz NOT NULL DEFAULT now(),
  completed_date timestamptz,
  score integer,
  report jsonb,
  error text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE credit_checks ENABLE ROW LEVEL SECURITY;

-- Create policies for customers
CREATE POLICY "organization_customers_select"
  ON customers
  FOR SELECT
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id 
      FROM organization_members 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "organization_customers_insert"
  ON customers
  FOR INSERT
  TO authenticated
  WITH CHECK (
    organization_id IN (
      SELECT organization_id 
      FROM organization_members 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "organization_customers_update"
  ON customers
  FOR UPDATE
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id 
      FROM organization_members 
      WHERE user_id = auth.uid()
    )
  )
  WITH CHECK (
    organization_id IN (
      SELECT organization_id 
      FROM organization_members 
      WHERE user_id = auth.uid()
    )
  );

-- Create policies for credit checks
CREATE POLICY "organization_credit_checks_select"
  ON credit_checks
  FOR SELECT
  TO authenticated
  USING (
    customer_id IN (
      SELECT id 
      FROM customers 
      WHERE organization_id IN (
        SELECT organization_id 
        FROM organization_members 
        WHERE user_id = auth.uid()
      )
    )
  );

CREATE POLICY "organization_credit_checks_insert"
  ON credit_checks
  FOR INSERT
  TO authenticated
  WITH CHECK (
    customer_id IN (
      SELECT id 
      FROM customers 
      WHERE organization_id IN (
        SELECT organization_id 
        FROM organization_members 
        WHERE user_id = auth.uid()
      )
    )
  );

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_customers_organization_id ON customers(organization_id);
CREATE INDEX IF NOT EXISTS idx_credit_checks_customer_id ON credit_checks(customer_id);
CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email);
CREATE INDEX IF NOT EXISTS idx_customers_status ON customers(status);
CREATE INDEX IF NOT EXISTS idx_customers_created_at ON customers(created_at);
CREATE INDEX IF NOT EXISTS idx_credit_checks_status ON credit_checks(status);
