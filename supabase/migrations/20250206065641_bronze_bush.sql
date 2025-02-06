/*
  # Fix Test User Password

  1. Changes
    - Updates test user password using Supabase's password hashing method
    - Sets proper email confirmation and metadata
    - Removes attempt to set generated columns
*/

-- Update test user with proper password hash
UPDATE auth.users
SET 
  encrypted_password = '$2a$10$5I7sinwxMN0w.UYg0Yz7o.R5DKuGjjnxK8gzqVKBxdxz5ZUtnz.zK', -- This is 'testpassword123'
  email_confirmed_at = NOW(),
  raw_app_meta_data = jsonb_build_object(
    'provider', 'email',
    'providers', ARRAY['email']
  ),
  raw_user_meta_data = jsonb_build_object(
    'full_name', 'Test User'
  ),
  is_sso_user = false
WHERE id = '00000000-0000-4000-9000-000000000000';