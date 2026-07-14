-- RVM EG MVP Supabase Schema

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create the creators table
CREATE TABLE creators (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    full_name TEXT NOT NULL,
    age INTEGER NOT NULL,
    gender TEXT NOT NULL,
    city TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT NOT NULL,
    instagram TEXT NOT NULL,
    tiktok TEXT NOT NULL,
    facebook TEXT,
    has_ugc_experience BOOLEAN NOT NULL,
    portfolio_url TEXT,
    preferred_niches TEXT[] NOT NULL,
    languages TEXT[] NOT NULL,
    equipment TEXT NOT NULL,
    availability TEXT NOT NULL,
    why_join TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    notes TEXT,

    -- Constraints
    CONSTRAINT age_check CHECK (age >= 16 AND age <= 100),
    CONSTRAINT status_check CHECK (status IN ('pending', 'approved', 'rejected')),
    CONSTRAINT email_check CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- Indexes
CREATE INDEX idx_creators_created_at ON creators(created_at DESC);
CREATE INDEX idx_creators_status ON creators(status);
CREATE INDEX idx_creators_city ON creators(city);
CREATE INDEX idx_creators_email ON creators(email);
CREATE INDEX idx_creators_phone ON creators(phone);

-- Function to update updated_at
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for updated_at
CREATE TRIGGER set_timestamp
BEFORE UPDATE ON creators
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

-- Row Level Security (RLS)
ALTER TABLE creators ENABLE ROW LEVEL SECURITY;

-- Allow public INSERT
CREATE POLICY "Allow public insert"
ON creators
FOR INSERT
TO public
WITH CHECK (true);

-- Disallow public SELECT, UPDATE, DELETE (they are default denied when RLS is enabled and no policy allows it)
-- The service role key bypasses RLS, so admins will use that to select/update/delete.
