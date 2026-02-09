/*
  # Add Business Context and Unified Customers Table

  ## Overview
  This migration extends the UCEdge prototype to support United Capital Group 360 
  across 4 business lines (Microfinance, Asset Management, Investment Banking, Wealth Management).
  It does NOT remove or replace existing tables, but adds a unified customer base and business context.

  ## New Tables

  1. **customers**
     - Base unified customer entity across all business lines
     - `id` (uuid, primary key)
     - `customer_number` (text, unique identifier)
     - `name` (text)
     - `email` (text)
     - `phone` (text)
     - `entity_type` (INDIVIDUAL | CORPORATE | GOVT)
     - `unique_identifiers` (jsonb) - stores BVN, NIN, RC_NUMBER, etc.
     - `risk_rating` (LOW | MEDIUM | HIGH)
     - `primary_relationship_owner_user_id` (uuid, FK to users)
     - `status` (ACTIVE | INACTIVE | PROSPECT)
     - Timestamps and metadata

  2. **business_units**
     - The 4 business lines of United Capital Group
     - `id`, `code` (MICROFIN | ASSETMGT | INVBANK | WEALTH), `name`, `description`

  3. **customer_business_profiles**
     - Links customers to business units with specific profile data
     - Each customer can have multiple profiles across different business units
     - Tracks KYC status, relationship owner, tags per business unit
     - `customer_id` (FK to customers)
     - `business_unit_id` (FK to business_units)
     - `profile_status` (ACTIVE | INACTIVE | PROSPECT)
     - `kyc_status` (PENDING | VERIFIED | REJECTED)
     - `relationship_owner_user_id` (FK to users)
     - `tags` (jsonb)

  4. **customer_timeline_events**
     - Unified timeline showing all customer activities across business units
     - Captures engagements, transactions, loans, portfolios, deals, consent, notes, support
     - `customer_id` (FK to customers)
     - `business_unit_id` (FK to business_units, nullable for cross-business events)
     - `event_type`, `title`, `description`, `metadata`, `occurred_at`
     - `created_by_user_id` (FK to users)

  5. **users**
     - System users (relationship managers, analysts, etc.)
     - Includes workspace preferences (default landing, pinned widgets, filters)

  ## Schema Modifications

  - Adds `customer_id` FK to existing tables: mfb_loans, fund_holdings, wealth_portfolios, deals
  - All existing tables remain intact with RLS enabled

  ## Security (RLS)

  - All new tables have RLS enabled
  - Policies restrict access to authenticated users only
  - Users can view all customers (for demo purposes, full access like Admin)

  ## Important Notes

  - This is a SYNC-FIRST enhancement - no existing data is removed
  - Existing flows (Segments → Campaigns → Journeys → Analytics) remain intact
  - Business context is additive, allowing filtering and cross-business reporting
*/

-- Create users table for relationship managers and analysts
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  full_name text NOT NULL,
  role text NOT NULL DEFAULT 'user',
  workspace_preferences jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all users"
  ON users FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Create business_units table
CREATE TABLE IF NOT EXISTS business_units (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL CHECK (code IN ('MICROFIN', 'ASSETMGT', 'INVBANK', 'WEALTH')),
  name text NOT NULL,
  description text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE business_units ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view business units"
  ON business_units FOR SELECT
  TO authenticated
  USING (true);

-- Insert the 4 business units
INSERT INTO business_units (code, name, description) VALUES
  ('MICROFIN', 'Microfinance Bank', 'Retail banking, savings, and microloans for individuals and SMEs'),
  ('ASSETMGT', 'Asset Management', 'Mutual funds, ETFs, and collective investment schemes'),
  ('INVBANK', 'Investment Banking', 'Corporate finance, M&A advisory, and capital markets'),
  ('WEALTH', 'Wealth Management', 'Private wealth, portfolio management, and family office services')
ON CONFLICT (code) DO NOTHING;

-- Create customers table (unified base)
CREATE TABLE IF NOT EXISTS customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_number text UNIQUE NOT NULL,
  name text NOT NULL,
  email text,
  phone text,
  entity_type text NOT NULL DEFAULT 'INDIVIDUAL' CHECK (entity_type IN ('INDIVIDUAL', 'CORPORATE', 'GOVT')),
  unique_identifiers jsonb DEFAULT '{}'::jsonb,
  risk_rating text DEFAULT 'MEDIUM' CHECK (risk_rating IN ('LOW', 'MEDIUM', 'HIGH')),
  primary_relationship_owner_user_id uuid REFERENCES users(id),
  status text DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'INACTIVE', 'PROSPECT')),
  date_joined timestamptz DEFAULT now(),
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view all customers"
  ON customers FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert customers"
  ON customers FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update customers"
  ON customers FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create index on customer_number for fast lookups
CREATE INDEX IF NOT EXISTS idx_customers_customer_number ON customers(customer_number);
CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email);
CREATE INDEX IF NOT EXISTS idx_customers_entity_type ON customers(entity_type);
CREATE INDEX IF NOT EXISTS idx_customers_risk_rating ON customers(risk_rating);

-- Create customer_business_profiles table
CREATE TABLE IF NOT EXISTS customer_business_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  business_unit_id uuid NOT NULL REFERENCES business_units(id) ON DELETE CASCADE,
  profile_status text DEFAULT 'ACTIVE' CHECK (profile_status IN ('ACTIVE', 'INACTIVE', 'PROSPECT')),
  kyc_status text DEFAULT 'PENDING' CHECK (kyc_status IN ('PENDING', 'VERIFIED', 'REJECTED')),
  relationship_owner_user_id uuid REFERENCES users(id),
  tags jsonb DEFAULT '[]'::jsonb,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(customer_id, business_unit_id)
);

ALTER TABLE customer_business_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view all customer profiles"
  ON customer_business_profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert customer profiles"
  ON customer_business_profiles FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update customer profiles"
  ON customer_business_profiles FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create indexes for customer_business_profiles
CREATE INDEX IF NOT EXISTS idx_customer_profiles_customer_id ON customer_business_profiles(customer_id);
CREATE INDEX IF NOT EXISTS idx_customer_profiles_business_unit_id ON customer_business_profiles(business_unit_id);
CREATE INDEX IF NOT EXISTS idx_customer_profiles_kyc_status ON customer_business_profiles(kyc_status);

-- Create customer_timeline_events table
CREATE TABLE IF NOT EXISTS customer_timeline_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  business_unit_id uuid REFERENCES business_units(id),
  event_type text NOT NULL CHECK (event_type IN ('ENGAGEMENT', 'TRANSACTION', 'LOAN', 'PORTFOLIO', 'DEAL', 'CONSENT', 'NOTE', 'SUPPORT', 'KYC', 'RISK_REVIEW', 'LIFECYCLE')),
  title text NOT NULL,
  description text,
  metadata jsonb DEFAULT '{}'::jsonb,
  occurred_at timestamptz DEFAULT now(),
  created_by_user_id uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE customer_timeline_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view all timeline events"
  ON customer_timeline_events FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert timeline events"
  ON customer_timeline_events FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Create indexes for customer_timeline_events
CREATE INDEX IF NOT EXISTS idx_timeline_customer_id ON customer_timeline_events(customer_id);
CREATE INDEX IF NOT EXISTS idx_timeline_business_unit_id ON customer_timeline_events(business_unit_id);
CREATE INDEX IF NOT EXISTS idx_timeline_event_type ON customer_timeline_events(event_type);
CREATE INDEX IF NOT EXISTS idx_timeline_occurred_at ON customer_timeline_events(occurred_at DESC);

-- Add customer_id to existing business tables if columns don't exist

-- Add to mfb_loans
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'mfb_loans' AND column_name = 'customer_id_ref'
  ) THEN
    ALTER TABLE mfb_loans ADD COLUMN customer_id_ref uuid REFERENCES customers(id);
    CREATE INDEX IF NOT EXISTS idx_mfb_loans_customer_id ON mfb_loans(customer_id_ref);
  END IF;
END $$;

-- Add to fund_holdings
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'fund_holdings' AND column_name = 'customer_id_ref'
  ) THEN
    ALTER TABLE fund_holdings ADD COLUMN customer_id_ref uuid REFERENCES customers(id);
    CREATE INDEX IF NOT EXISTS idx_fund_holdings_customer_id ON fund_holdings(customer_id_ref);
  END IF;
END $$;

-- Add to fund_transactions
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'fund_transactions' AND column_name = 'customer_id_ref'
  ) THEN
    ALTER TABLE fund_transactions ADD COLUMN customer_id_ref uuid REFERENCES customers(id);
    CREATE INDEX IF NOT EXISTS idx_fund_transactions_customer_id ON fund_transactions(customer_id_ref);
  END IF;
END $$;

-- Add to wealth_portfolios
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'wealth_portfolios' AND column_name = 'customer_id_ref'
  ) THEN
    ALTER TABLE wealth_portfolios ADD COLUMN customer_id_ref uuid REFERENCES customers(id);
    CREATE INDEX IF NOT EXISTS idx_wealth_portfolios_customer_id ON wealth_portfolios(customer_id_ref);
  END IF;
END $$;

-- Add to deals
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'deals' AND column_name = 'customer_id_ref'
  ) THEN
    ALTER TABLE deals ADD COLUMN customer_id_ref uuid REFERENCES customers(id);
    CREATE INDEX IF NOT EXISTS idx_deals_customer_id ON deals(customer_id_ref);
  END IF;
END $$;

-- Create a view for unified customer 360
CREATE OR REPLACE VIEW customer_360_view AS
SELECT 
  c.id,
  c.customer_number,
  c.name,
  c.email,
  c.phone,
  c.entity_type,
  c.risk_rating,
  c.status,
  c.date_joined,
  jsonb_agg(DISTINCT jsonb_build_object(
    'business_unit', bu.code,
    'business_name', bu.name,
    'profile_status', cbp.profile_status,
    'kyc_status', cbp.kyc_status,
    'relationship_owner', u.full_name
  )) FILTER (WHERE cbp.id IS NOT NULL) as business_profiles,
  (SELECT COUNT(*) FROM customer_timeline_events WHERE customer_id = c.id) as total_events,
  (SELECT COUNT(*) FROM mfb_loans WHERE customer_id_ref = c.id) as total_loans,
  (SELECT COUNT(*) FROM fund_holdings WHERE customer_id_ref = c.id) as total_fund_holdings,
  (SELECT COUNT(*) FROM wealth_portfolios WHERE customer_id_ref = c.id) as total_wealth_portfolios,
  (SELECT COUNT(*) FROM deals WHERE customer_id_ref = c.id) as total_deals
FROM customers c
LEFT JOIN customer_business_profiles cbp ON c.id = cbp.customer_id
LEFT JOIN business_units bu ON cbp.business_unit_id = bu.id
LEFT JOIN users u ON cbp.relationship_owner_user_id = u.id
GROUP BY c.id;
