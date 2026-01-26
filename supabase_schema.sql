-- Supabase Users Table Schema
-- Run this SQL in your Supabase SQL Editor to create the users table

CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name VARCHAR(255) NOT NULL,
  birthday DATE,
  role VARCHAR(50) DEFAULT 'customer' CHECK (role IN ('admin', 'customer')),
  refresh_token TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- Create trigger to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Disable Row Level Security (RLS) for custom authentication
-- Since we're using custom JWT auth (not Supabase Auth), we disable RLS
-- and handle authentication/authorization in the backend
ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- If you want to enable RLS later with Supabase Auth, uncomment below:
-- ALTER TABLE users ENABLE ROW LEVEL SECURITY;
-- 
-- CREATE POLICY "Service role can do everything" ON users
--   FOR ALL
--   TO service_role
--   USING (true);
-- 
-- CREATE POLICY "Enable read access for authenticated users" ON users
--   FOR SELECT
--   TO authenticated
--   USING (true);
