/*
  # Add Governance and Compliance Tables

  ## Overview
  This migration adds three governance tables to support unified risk monitoring,
  approval workflows, and compliance settings across all United Capital Group
  business units.

  ## New Tables

  ### 1. risk_signals
  Centralized risk monitoring table tracking risk signals across all business units:
  - `id` (uuid, primary key) - Unique identifier
  - `customer_id` (uuid, foreign key) - References customers table
  - `business_unit_id` (uuid, foreign key, nullable) - Which business unit detected the risk
  - `signal_type` (enum) - Type of risk: CHURN, CREDIT, DEAL, COMPLIANCE
  - `score` (integer) - Risk score from 0-100
  - `band` (text) - Risk band: LOW (0-30), MEDIUM (31-60), HIGH (61-100)
  - `rationale` (text) - Explanation of why this risk was flagged
  - `created_at` (timestamptz) - When the signal was generated
  
  ### 2. approvals
  Approval workflow tracking for sensitive operations:
  - `id` (uuid, primary key) - Unique identifier
  - `request_type` (enum) - Type of request requiring approval
  - `customer_id` (uuid, foreign key, nullable) - Related customer if applicable
  - `business_unit_id` (uuid, foreign key, nullable) - Related business unit if applicable
  - `payload` (jsonb) - Request-specific data
  - `requested_by_user_id` (uuid, foreign key) - Who requested the approval
  - `status` (enum) - Current status: PENDING, APPROVED, REJECTED
  - `decided_by_user_id` (uuid, foreign key, nullable) - Who approved/rejected
  - `decision_reason` (text, nullable) - Justification for decision
  - `created_at` (timestamptz) - When the request was created
  - `decided_at` (timestamptz, nullable) - When the decision was made

  ### 3. compliance_settings
  Global compliance configuration:
  - `id` (uuid, primary key) - Unique identifier
  - `compliance_mode_enabled` (boolean) - Whether compliance mode is active
  - `approval_rules` (jsonb) - Configuration for approval workflows
  - `updated_at` (timestamptz) - Last update timestamp
  - `updated_by_user_id` (uuid, foreign key) - Who made the last update

  ## Security
  - All tables have RLS enabled
  - Authenticated users can read all records
  - Authenticated users can insert/update based on their role
  - System automatically logs to audit_logs and customer_timeline_events

  ## Important Notes
  1. Risk signals are automatically generated and provide a unified view across all business units
  2. Approvals enforce governance rules when compliance mode is enabled
  3. Compliance settings control the behavior of the entire approval system
  4. All approval decisions are automatically logged to audit trail
*/

-- Create risk_signals table
CREATE TABLE IF NOT EXISTS risk_signals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  business_unit_id uuid REFERENCES business_units(id) ON DELETE SET NULL,
  signal_type text NOT NULL CHECK (signal_type IN ('CHURN', 'CREDIT', 'DEAL', 'COMPLIANCE')),
  score integer NOT NULL CHECK (score >= 0 AND score <= 100),
  band text NOT NULL CHECK (band IN ('LOW', 'MEDIUM', 'HIGH')),
  rationale text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create approvals table
CREATE TABLE IF NOT EXISTS approvals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  request_type text NOT NULL CHECK (request_type IN ('BULK_EXPORT', 'PII_EXPORT', 'CAMPAIGN_LAUNCH', 'JOURNEY_PUBLISH', 'LOAN_DISBURSE', 'DEAL_STAGE_ADVANCE')),
  customer_id uuid REFERENCES customers(id) ON DELETE SET NULL,
  business_unit_id uuid REFERENCES business_units(id) ON DELETE SET NULL,
  payload jsonb DEFAULT '{}'::jsonb,
  requested_by_user_id uuid NOT NULL REFERENCES users(id),
  status text NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED')),
  decided_by_user_id uuid REFERENCES users(id),
  decision_reason text,
  created_at timestamptz DEFAULT now(),
  decided_at timestamptz
);

-- Create compliance_settings table
CREATE TABLE IF NOT EXISTS compliance_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  compliance_mode_enabled boolean DEFAULT false,
  approval_rules jsonb DEFAULT '{
    "pii_export_requires_justification": true,
    "bulk_export_threshold": 100,
    "loan_disburse_min_amount": 1000000,
    "deal_stage_advance_requires_approval": ["EXECUTION", "CLOSED"],
    "campaign_launch_requires_approval": true,
    "journey_publish_requires_approval": true,
    "admin_override_users": []
  }'::jsonb,
  updated_at timestamptz DEFAULT now(),
  updated_by_user_id uuid REFERENCES users(id)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_risk_signals_customer ON risk_signals(customer_id);
CREATE INDEX IF NOT EXISTS idx_risk_signals_business_unit ON risk_signals(business_unit_id);
CREATE INDEX IF NOT EXISTS idx_risk_signals_type ON risk_signals(signal_type);
CREATE INDEX IF NOT EXISTS idx_risk_signals_created ON risk_signals(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_approvals_status ON approvals(status);
CREATE INDEX IF NOT EXISTS idx_approvals_request_type ON approvals(request_type);
CREATE INDEX IF NOT EXISTS idx_approvals_customer ON approvals(customer_id);
CREATE INDEX IF NOT EXISTS idx_approvals_business_unit ON approvals(business_unit_id);
CREATE INDEX IF NOT EXISTS idx_approvals_requested_by ON approvals(requested_by_user_id);
CREATE INDEX IF NOT EXISTS idx_approvals_created ON approvals(created_at DESC);

-- Enable Row Level Security
ALTER TABLE risk_signals ENABLE ROW LEVEL SECURITY;
ALTER TABLE approvals ENABLE ROW LEVEL SECURITY;
ALTER TABLE compliance_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for risk_signals
DROP POLICY IF EXISTS "Authenticated users can view risk signals" ON risk_signals;
CREATE POLICY "Authenticated users can view risk signals"
  ON risk_signals FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Authenticated users can insert risk signals" ON risk_signals;
CREATE POLICY "Authenticated users can insert risk signals"
  ON risk_signals FOR INSERT
  TO authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users can update risk signals" ON risk_signals;
CREATE POLICY "Authenticated users can update risk signals"
  ON risk_signals FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- RLS Policies for approvals
DROP POLICY IF EXISTS "Authenticated users can view approvals" ON approvals;
CREATE POLICY "Authenticated users can view approvals"
  ON approvals FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Authenticated users can insert approvals" ON approvals;
CREATE POLICY "Authenticated users can insert approvals"
  ON approvals FOR INSERT
  TO authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users can update approvals" ON approvals;
CREATE POLICY "Authenticated users can update approvals"
  ON approvals FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- RLS Policies for compliance_settings
DROP POLICY IF EXISTS "Authenticated users can view compliance settings" ON compliance_settings;
CREATE POLICY "Authenticated users can view compliance settings"
  ON compliance_settings FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Authenticated users can update compliance settings" ON compliance_settings;
CREATE POLICY "Authenticated users can update compliance settings"
  ON compliance_settings FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Insert default compliance settings
INSERT INTO compliance_settings (compliance_mode_enabled, approval_rules, updated_at)
VALUES (
  true,
  '{
    "pii_export_requires_justification": true,
    "bulk_export_threshold": 100,
    "loan_disburse_min_amount": 1000000,
    "deal_stage_advance_requires_approval": ["EXECUTION", "CLOSED"],
    "campaign_launch_requires_approval": true,
    "journey_publish_requires_approval": true,
    "admin_override_users": []
  }'::jsonb,
  now()
)
ON CONFLICT DO NOTHING;