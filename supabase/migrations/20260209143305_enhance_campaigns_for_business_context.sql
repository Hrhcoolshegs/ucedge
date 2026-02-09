/*
  # Enhance Campaigns and Journeys for Business Context

  ## Overview
  This migration extends campaigns and journeys to support business-specific marketing automation
  across all 4 United Capital Group business lines.

  ## Campaign Enhancements
  Adds optional business context fields to campaigns:
  - business_unit_id: Links campaign to specific business unit
  - product_context: JSONB storing product-specific data (fund_id, loan_product, etc.)
  - objective: Campaign goal (ONBOARDING, RETENTION, CROSS_SELL, COLLECTIONS, DEAL_NURTURE)

  ## Segment Enhancements
  Adds business-specific filter criteria to segments:
  - business_filters: JSONB storing filters for loans, funds, portfolios, deals

  ## Journey Enhancements  
  Adds business trigger support to journeys:
  - trigger_business_context: JSONB storing business-specific trigger conditions

  ## Security
  - All tables maintain existing RLS policies
  - No breaking changes to existing functionality

  ## Notes
  - All new fields are nullable/optional
  - Existing campaigns and journeys continue to work without modification
*/

-- Create campaigns table if not exists (for storing marketing campaigns)
CREATE TABLE IF NOT EXISTS campaigns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type text NOT NULL DEFAULT 'Email' CHECK (type IN ('Email', 'SMS', 'WhatsApp', 'Push')),
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'active', 'paused', 'completed')),
  target_audience text,
  lifecycle_target text,
  segment_size integer DEFAULT 0,
  subject text,
  message text NOT NULL,
  cta_text text,
  cta_link text,
  launch_date timestamptz,
  end_date timestamptz,
  sent integer DEFAULT 0,
  delivered integer DEFAULT 0,
  opened integer DEFAULT 0,
  clicked integer DEFAULT 0,
  converted integer DEFAULT 0,
  revenue numeric(15,2) DEFAULT 0,
  roi numeric(10,2) DEFAULT 0,
  business_unit_id uuid REFERENCES business_units(id),
  product_context jsonb DEFAULT '{}'::jsonb,
  objective text CHECK (objective IN ('ONBOARDING', 'RETENTION', 'CROSS_SELL', 'COLLECTIONS', 'DEAL_NURTURE', 'ENGAGEMENT', 'REACTIVATION')),
  created_by_user_id uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add business context columns if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'campaigns' AND column_name = 'business_unit_id'
  ) THEN
    ALTER TABLE campaigns ADD COLUMN business_unit_id uuid REFERENCES business_units(id);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'campaigns' AND column_name = 'product_context'
  ) THEN
    ALTER TABLE campaigns ADD COLUMN product_context jsonb DEFAULT '{}'::jsonb;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'campaigns' AND column_name = 'objective'
  ) THEN
    ALTER TABLE campaigns ADD COLUMN objective text CHECK (objective IN ('ONBOARDING', 'RETENTION', 'CROSS_SELL', 'COLLECTIONS', 'DEAL_NURTURE', 'ENGAGEMENT', 'REACTIVATION'));
  END IF;
END $$;

ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;

-- Drop and recreate policies to avoid conflicts
DROP POLICY IF EXISTS "Authenticated users can view campaigns" ON campaigns;
DROP POLICY IF EXISTS "Authenticated users can manage campaigns" ON campaigns;

CREATE POLICY "Authenticated users can view campaigns"
  ON campaigns FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can manage campaigns"
  ON campaigns FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_campaigns_business_unit ON campaigns(business_unit_id);
CREATE INDEX IF NOT EXISTS idx_campaigns_objective ON campaigns(objective);
CREATE INDEX IF NOT EXISTS idx_campaigns_status ON campaigns(status);

-- Create segments table if not exists
CREATE TABLE IF NOT EXISTS segments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  type text DEFAULT 'custom' CHECK (type IN ('lifecycle', 'sentiment', 'custom', 'auto', 'business')),
  customer_count integer DEFAULT 0,
  criteria jsonb DEFAULT '{}'::jsonb,
  business_filters jsonb DEFAULT '{}'::jsonb,
  metrics jsonb DEFAULT '{}'::jsonb,
  is_auto_generated boolean DEFAULT false,
  created_by_user_id uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add business_filters column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'segments' AND column_name = 'business_filters'
  ) THEN
    ALTER TABLE segments ADD COLUMN business_filters jsonb DEFAULT '{}'::jsonb;
  END IF;
END $$;

ALTER TABLE segments ENABLE ROW LEVEL SECURITY;

-- Drop and recreate policies to avoid conflicts
DROP POLICY IF EXISTS "Authenticated users can view segments" ON segments;
DROP POLICY IF EXISTS "Authenticated users can manage segments" ON segments;

CREATE POLICY "Authenticated users can view segments"
  ON segments FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can manage segments"
  ON segments FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_segments_type ON segments(type);

-- Create journeys table if not exists
CREATE TABLE IF NOT EXISTS journeys (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'paused', 'archived')),
  trigger_type text NOT NULL,
  trigger_business_context jsonb DEFAULT '{}'::jsonb,
  flow_definition jsonb DEFAULT '{}'::jsonb,
  active_executions integer DEFAULT 0,
  completed_executions integer DEFAULT 0,
  conversion_rate numeric(5,2) DEFAULT 0,
  created_by_user_id uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add trigger_business_context column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'journeys' AND column_name = 'trigger_business_context'
  ) THEN
    ALTER TABLE journeys ADD COLUMN trigger_business_context jsonb DEFAULT '{}'::jsonb;
  END IF;
END $$;

ALTER TABLE journeys ENABLE ROW LEVEL SECURITY;

-- Drop and recreate policies to avoid conflicts
DROP POLICY IF EXISTS "Authenticated users can view journeys" ON journeys;
DROP POLICY IF EXISTS "Authenticated users can manage journeys" ON journeys;

CREATE POLICY "Authenticated users can view journeys"
  ON journeys FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can manage journeys"
  ON journeys FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_journeys_status ON journeys(status);
CREATE INDEX IF NOT EXISTS idx_journeys_trigger_type ON journeys(trigger_type);
