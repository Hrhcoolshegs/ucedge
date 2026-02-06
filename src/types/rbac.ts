export type Permission =
  | 'can_view_dashboard'
  | 'can_view_analytics'
  | 'can_view_customers'
  | 'can_view_audit'
  | 'can_view_consent'
  | 'can_view_governance'
  | 'can_view_reports'
  | 'can_create_campaigns'
  | 'can_edit_campaigns'
  | 'can_approve_content'
  | 'can_create_journeys'
  | 'can_edit_journeys'
  | 'can_manage_segments'
  | 'can_export_data'
  | 'can_export_without_approval'
  | 'can_bulk_export_without_approval'
  | 'can_manage_users'
  | 'can_approve_actions'
  | 'can_manual_trigger';

export type UserRole = 'admin' | 'campaign_manager' | 'analyst';

export interface RoleDefinition {
  role: UserRole;
  label: string;
  description: string;
  permissions: Permission[];
}

export const ROLE_DEFINITIONS: Record<UserRole, RoleDefinition> = {
  admin: {
    role: 'admin',
    label: 'Admin',
    description: 'Full access to all features including user management and approvals',
    permissions: [
      'can_view_dashboard',
      'can_view_analytics',
      'can_view_customers',
      'can_view_audit',
      'can_view_consent',
      'can_view_governance',
      'can_view_reports',
      'can_create_campaigns',
      'can_edit_campaigns',
      'can_approve_content',
      'can_create_journeys',
      'can_edit_journeys',
      'can_manage_segments',
      'can_export_data',
      'can_export_without_approval',
      'can_bulk_export_without_approval',
      'can_manage_users',
      'can_approve_actions',
      'can_manual_trigger',
    ],
  },
  campaign_manager: {
    role: 'campaign_manager',
    label: 'Campaign Manager',
    description: 'Can create and manage campaigns and journeys, bulk exports require approval',
    permissions: [
      'can_view_dashboard',
      'can_view_analytics',
      'can_view_customers',
      'can_view_audit',
      'can_view_consent',
      'can_view_governance',
      'can_view_reports',
      'can_create_campaigns',
      'can_edit_campaigns',
      'can_create_journeys',
      'can_edit_journeys',
      'can_manage_segments',
      'can_export_data',
      'can_export_without_approval',
      'can_manual_trigger',
    ],
  },
  analyst: {
    role: 'analyst',
    label: 'Analyst',
    description: 'Read-only access to reports and analytics, PII exports require approval',
    permissions: [
      'can_view_dashboard',
      'can_view_analytics',
      'can_view_customers',
      'can_view_audit',
      'can_view_consent',
      'can_view_governance',
      'can_view_reports',
      'can_export_data',
    ],
  },
};

export function hasPermission(role: UserRole, permission: Permission): boolean {
  return ROLE_DEFINITIONS[role].permissions.includes(permission);
}
