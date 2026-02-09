/*
  # Create Churn Metric Configuration Tables

  1. New Tables
    - `churn_stages`
      - `id` (uuid, primary key)
      - `name` (text) - Stage name like "Healthy", "At Risk", "Churning", "Churned"
      - `slug` (text, unique) - URL-friendly identifier
      - `description` (text) - Explanation of the stage
      - `color` (text) - Hex color for UI display
      - `severity` (integer) - 0 = healthy, 1 = warning, 2 = danger, 3 = critical
      - `sort_order` (integer) - Display order
      - `is_active` (boolean) - Whether this stage is enabled
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `churn_metrics`
      - `id` (uuid, primary key)
      - `name` (text) - Human-readable metric name
      - `description` (text) - What this metric measures
      - `customer_field` (text) - The customer data field to evaluate
      - `operator` (text) - Comparison operator (gt, gte, lt, lte, eq, between)
      - `threshold_value` (numeric) - Primary threshold
      - `threshold_value_max` (numeric, nullable) - Secondary threshold for "between"
      - `unit` (text) - Unit label (days, NGN, count, percent)
      - `weight` (numeric) - Importance weight 1-10
      - `churn_stage_id` (uuid, FK) - Which churn stage this metric signals
      - `is_active` (boolean) - Whether this metric is currently enabled
      - `created_by` (text) - Who created/last modified
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Policies for authenticated users to read data
    - Policies for authenticated users to insert/update/delete data

  3. Seed Data
    - 4 default churn stages
    - 8 default metric configurations
*/

-- Churn Stages
CREATE TABLE IF NOT EXISTS churn_stages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text NOT NULL DEFAULT '',
  color text NOT NULL DEFAULT '#6b7280',
  severity integer NOT NULL DEFAULT 0,
  sort_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE churn_stages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view churn stages"
  ON churn_stages FOR SELECT
  TO authenticated
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can insert churn stages"
  ON churn_stages FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update churn stages"
  ON churn_stages FOR UPDATE
  TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete churn stages"
  ON churn_stages FOR DELETE
  TO authenticated
  USING (auth.uid() IS NOT NULL);

-- Churn Metrics
CREATE TABLE IF NOT EXISTS churn_metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL DEFAULT '',
  customer_field text NOT NULL,
  operator text NOT NULL DEFAULT 'gte',
  threshold_value numeric NOT NULL DEFAULT 0,
  threshold_value_max numeric,
  unit text NOT NULL DEFAULT 'count',
  weight numeric NOT NULL DEFAULT 5,
  churn_stage_id uuid NOT NULL REFERENCES churn_stages(id),
  is_active boolean NOT NULL DEFAULT true,
  created_by text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE churn_metrics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view churn metrics"
  ON churn_metrics FOR SELECT
  TO authenticated
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can insert churn metrics"
  ON churn_metrics FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update churn metrics"
  ON churn_metrics FOR UPDATE
  TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete churn metrics"
  ON churn_metrics FOR DELETE
  TO authenticated
  USING (auth.uid() IS NOT NULL);

CREATE INDEX IF NOT EXISTS idx_churn_metrics_stage ON churn_metrics(churn_stage_id);
CREATE INDEX IF NOT EXISTS idx_churn_metrics_active ON churn_metrics(is_active);

-- Seed default churn stages
INSERT INTO churn_stages (name, slug, description, color, severity, sort_order) VALUES
  ('Healthy', 'healthy', 'Customer is actively engaged with no risk signals', '#10b981', 0, 0),
  ('At Risk', 'at-risk', 'Early warning signals detected, intervention recommended', '#f59e0b', 1, 1),
  ('Churning', 'churning', 'Customer shows strong churn signals, urgent action needed', '#f97316', 2, 2),
  ('Churned', 'churned', 'Customer has stopped engaging entirely', '#ef4444', 3, 3);

-- Seed default churn metrics
INSERT INTO churn_metrics (name, description, customer_field, operator, threshold_value, unit, weight, churn_stage_id, created_by)
SELECT
  v.name, v.description, v.customer_field, v.operator, v.threshold_value, v.unit, v.weight,
  cs.id, 'system'
FROM (VALUES
  ('Days Inactive', 'Number of days since the customer last performed any activity', 'daysInactive', 'gte', 14, 'days', 8, 'at-risk'),
  ('Balance Drop', 'Account balance has fallen below a critical threshold', 'accountBalance', 'lte', 50000, 'NGN', 6, 'at-risk'),
  ('Low Sentiment Score', 'Customer sentiment score has dropped below acceptable level', 'sentimentScore', 'lte', 3, 'score', 7, 'at-risk'),
  ('Transaction Frequency Decline', 'Monthly transactions have dropped significantly', 'transactionFrequency', 'lte', 2, 'count', 5, 'churning'),
  ('Extended Inactivity', 'Customer has been inactive for an extended period', 'daysInactive', 'gte', 45, 'days', 9, 'churning'),
  ('Zero Engagement', 'Customer has not engaged with any campaigns', 'campaignsEngaged', 'lte', 0, 'count', 6, 'churning'),
  ('Complete Inactivity', 'No activity for 90+ days indicates full churn', 'daysInactive', 'gte', 90, 'days', 10, 'churned'),
  ('Support Ticket Spike', 'High number of support tickets indicates dissatisfaction', 'supportTickets', 'gte', 8, 'count', 7, 'at-risk')
) AS v(name, description, customer_field, operator, threshold_value, unit, weight, stage_slug)
JOIN churn_stages cs ON cs.slug = v.stage_slug;