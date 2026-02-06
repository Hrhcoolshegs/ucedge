import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface CommunicationAuditLog {
  id?: string;
  customer_id: string;
  customer_name: string;
  customer_email?: string;
  customer_phone?: string;
  message_content: string;
  template_id?: string;
  template_version?: string;
  personalization_data?: Record<string, any>;
  subject?: string;
  scheduled_time?: string;
  sent_time?: string;
  delivered_time?: string;
  opened_time?: string;
  clicked_time?: string;
  channel: string;
  trigger_type: string;
  journey_id?: string;
  journey_name?: string;
  campaign_id?: string;
  campaign_name?: string;
  delivery_status: string;
  failure_reason?: string;
  consent_status?: Record<string, any>;
  content_hash: string;
  gdpr_compliant?: boolean;
  data_residency?: string;
  initiated_by?: string;
  approved_by?: string;
  created_at?: string;
}

export interface ActivityLog {
  id?: string;
  user_id: string;
  user_name: string;
  user_role: string;
  action_type: string;
  resource?: string;
  resource_id?: string;
  details?: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
  session_id?: string;
  timestamp?: string;
  created_at?: string;
}
