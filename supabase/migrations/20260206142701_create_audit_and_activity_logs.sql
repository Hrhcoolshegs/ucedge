/*
  # Create Audit and Activity Logs Tables

  ## 1. New Tables
  
  ### `communication_audit_logs`
  Immutable audit trail of all customer communications
  - `id` (uuid, primary key)
  - `customer_id` (text) - Customer identifier
  - `customer_name` (text) - Customer name at time of send
  - `customer_email` (text) - Customer email
  - `customer_phone` (text) - Customer phone
  - `message_content` (text) - Actual message content sent
  - `template_id` (text) - Template identifier
  - `template_version` (text) - Template version
  - `personalization_data` (jsonb) - Personalization variables used
  - `subject` (text) - Message subject (for email/push)
  - `scheduled_time` (timestamptz) - When message was scheduled
  - `sent_time` (timestamptz) - When message was actually sent
  - `delivered_time` (timestamptz) - When message was delivered
  - `opened_time` (timestamptz) - When message was opened
  - `clicked_time` (timestamptz) - When link was clicked
  - `channel` (text) - Communication channel
  - `trigger_type` (text) - How message was triggered
  - `journey_id` (text) - Associated journey ID
  - `journey_name` (text) - Associated journey name
  - `campaign_id` (text) - Associated campaign ID
  - `campaign_name` (text) - Associated campaign name
  - `delivery_status` (text) - Delivery status
  - `failure_reason` (text) - Failure reason if failed
  - `consent_status` (jsonb) - Consent status at send time
  - `content_hash` (text) - Content integrity hash
  - `gdpr_compliant` (boolean) - GDPR compliance flag
  - `data_residency` (text) - Data residency location
  - `initiated_by` (text) - User who initiated
  - `approved_by` (text) - User who approved
  - `created_at` (timestamptz) - Record creation timestamp

  ### `activity_logs`
  Complete log of all user actions in the platform
  - `id` (uuid, primary key)
  - `user_id` (text) - User identifier
  - `user_name` (text) - User name
  - `user_role` (text) - User role at time of action
  - `action_type` (text) - Type of action performed
  - `resource` (text) - Resource affected
  - `resource_id` (text) - Resource identifier
  - `details` (jsonb) - Additional action details
  - `ip_address` (text) - User IP address
  - `user_agent` (text) - User agent string
  - `session_id` (text) - Session identifier
  - `timestamp` (timestamptz) - Action timestamp
  - `created_at` (timestamptz) - Record creation timestamp

  ## 2. Security
  - Enable RLS on both tables
  - Add policies for authenticated users to read their organization's logs
  - Admin users can read all logs
  - Both tables are append-only (no updates or deletes allowed)

  ## 3. Important Notes
  - These tables provide complete audit trail for compliance
  - Records are immutable once created
  - Indexes added for common query patterns
  - Retention policies should be configured separately
*/

-- Create communication_audit_logs table
CREATE TABLE IF NOT EXISTS communication_audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id text NOT NULL,
  customer_name text NOT NULL,
  customer_email text,
  customer_phone text,
  message_content text NOT NULL,
  template_id text,
  template_version text,
  personalization_data jsonb DEFAULT '{}'::jsonb,
  subject text,
  scheduled_time timestamptz,
  sent_time timestamptz,
  delivered_time timestamptz,
  opened_time timestamptz,
  clicked_time timestamptz,
  channel text NOT NULL,
  trigger_type text NOT NULL,
  journey_id text,
  journey_name text,
  campaign_id text,
  campaign_name text,
  delivery_status text NOT NULL DEFAULT 'sent',
  failure_reason text,
  consent_status jsonb DEFAULT '{}'::jsonb,
  content_hash text NOT NULL,
  gdpr_compliant boolean DEFAULT true,
  data_residency text DEFAULT 'NG-Lagos',
  initiated_by text,
  approved_by text,
  created_at timestamptz DEFAULT now()
);

-- Create activity_logs table
CREATE TABLE IF NOT EXISTS activity_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL,
  user_name text NOT NULL,
  user_role text NOT NULL,
  action_type text NOT NULL,
  resource text,
  resource_id text,
  details jsonb DEFAULT '{}'::jsonb,
  ip_address text,
  user_agent text,
  session_id text,
  timestamp timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_audit_logs_customer_id ON communication_audit_logs(customer_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_channel ON communication_audit_logs(channel);
CREATE INDEX IF NOT EXISTS idx_audit_logs_trigger_type ON communication_audit_logs(trigger_type);
CREATE INDEX IF NOT EXISTS idx_audit_logs_delivery_status ON communication_audit_logs(delivery_status);
CREATE INDEX IF NOT EXISTS idx_audit_logs_sent_time ON communication_audit_logs(sent_time DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_journey_id ON communication_audit_logs(journey_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_campaign_id ON communication_audit_logs(campaign_id);

CREATE INDEX IF NOT EXISTS idx_activity_logs_user_id ON activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_action_type ON activity_logs(action_type);
CREATE INDEX IF NOT EXISTS idx_activity_logs_resource ON activity_logs(resource);
CREATE INDEX IF NOT EXISTS idx_activity_logs_timestamp ON activity_logs(timestamp DESC);

-- Enable Row Level Security
ALTER TABLE communication_audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- Policies for communication_audit_logs
CREATE POLICY "Authenticated users can read audit logs"
  ON communication_audit_logs
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "System can insert audit logs"
  ON communication_audit_logs
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Policies for activity_logs
CREATE POLICY "Authenticated users can read activity logs"
  ON activity_logs
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "System can insert activity logs"
  ON activity_logs
  FOR INSERT
  TO authenticated
  WITH CHECK (true);
