import { useAuth } from '@/contexts/AuthContext';
import { Permission, hasPermission } from '@/types/rbac';

export function usePermission(permission: Permission): boolean {
  const { user } = useAuth();
  if (!user?.role) return false;
  return hasPermission(user.role, permission);
}

export function useExportApprovalRequired(recordCount: number = 0, containsPII: boolean = false): boolean {
  const { user } = useAuth();
  if (!user?.role) return true;

  if (user.role === 'admin') return false;
  if (user.role === 'analyst' && containsPII) return true;
  if (user.role === 'campaign_manager' && recordCount > 500) return true;

  return false;
}
