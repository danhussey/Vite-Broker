/*
  # Create Test User and Organization Association

  1. Changes
    - Creates a test user in auth.users
    - Creates a profile for the test user
    - Associates the test user with the test organization
    - Sets the user as an admin of the organization

  2. Security
    - Uses secure password hashing
    - Sets up proper role and permissions
*/

-- Create test user if they don't exist
DO $$
DECLARE
  test_user_id uuid;
BEGIN
  -- Insert test user into auth.users if they don't exist
  INSERT INTO auth.users (
    id,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token
  )
  VALUES (
    '00000000-0000-4000-9000-000000000000', -- Fixed UUID for test user
    'test@example.com',
    crypt('testpassword123', gen_salt('bf')), -- Using secure password hashing
    NOW(),
    '{"provider":"email","providers":["email"]}',
    '{"full_name":"Test User"}',
    NOW(),
    NOW(),
    '',
    '',
    '',
    ''
  )
  ON CONFLICT (id) DO NOTHING
  RETURNING id INTO test_user_id;

  -- Create profile for test user if they don't exist
  INSERT INTO public.profiles (
    id,
    email,
    full_name,
    organization_id
  )
  VALUES (
    '00000000-0000-4000-9000-000000000000',
    'test@example.com',
    'Test User',
    '00000000-0000-4000-8000-000000000000'
  )
  ON CONFLICT (id) DO NOTHING;

  -- Add test user as admin of test organization if not already added
  INSERT INTO public.organization_members (
    organization_id,
    user_id,
    role
  )
  VALUES (
    '00000000-0000-4000-8000-000000000000',
    '00000000-0000-4000-9000-000000000000',
    'admin'
  )
  ON CONFLICT (organization_id, user_id) DO NOTHING;
END $$;