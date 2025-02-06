/*
  # Clean up duplicate customers

  1. Changes
    - Remove duplicate customer records keeping most recent entries
    - Remove associated credit checks for deleted customers
*/

-- Create a temporary table to store the most recent customer records
CREATE TEMP TABLE latest_customers AS
SELECT DISTINCT ON (organization_id, email) 
  id,
  created_at
FROM customers
ORDER BY organization_id, email, created_at DESC;

-- Delete credit checks for customers that will be removed
DELETE FROM credit_checks
WHERE customer_id IN (
  SELECT c.id 
  FROM customers c
  LEFT JOIN latest_customers lc ON c.id = lc.id
  WHERE lc.id IS NULL
);

-- Delete duplicate customers, keeping only the most recent entries
DELETE FROM customers
WHERE id NOT IN (SELECT id FROM latest_customers);

-- Drop the temporary table
DROP TABLE latest_customers;