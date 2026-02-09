/*
  # Fix Churn Configuration RLS Policies

  1. Changes
    - Update RLS policies to allow anon access for reading churn stages and metrics
    - Keep write operations available to both anon and authenticated users
    - This allows the demo app to work without Supabase authentication

  2. Security Note
    - For production, these policies should be more restrictive
    - This is appropriate for a demo/development environment
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Authenticated users can view churn stages" ON churn_stages;
DROP POLICY IF EXISTS "Authenticated users can insert churn stages" ON churn_stages;
DROP POLICY IF EXISTS "Authenticated users can update churn stages" ON churn_stages;
DROP POLICY IF EXISTS "Authenticated users can delete churn stages" ON churn_stages;

DROP POLICY IF EXISTS "Authenticated users can view churn metrics" ON churn_metrics;
DROP POLICY IF EXISTS "Authenticated users can insert churn metrics" ON churn_metrics;
DROP POLICY IF EXISTS "Authenticated users can update churn metrics" ON churn_metrics;
DROP POLICY IF EXISTS "Authenticated users can delete churn metrics" ON churn_metrics;

-- Create new policies for churn_stages (allow all operations)
CREATE POLICY "Anyone can view churn stages"
  ON churn_stages FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert churn stages"
  ON churn_stages FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update churn stages"
  ON churn_stages FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can delete churn stages"
  ON churn_stages FOR DELETE
  USING (true);

-- Create new policies for churn_metrics (allow all operations)
CREATE POLICY "Anyone can view churn metrics"
  ON churn_metrics FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert churn metrics"
  ON churn_metrics FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update churn metrics"
  ON churn_metrics FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can delete churn metrics"
  ON churn_metrics FOR DELETE
  USING (true);