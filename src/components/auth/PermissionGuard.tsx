import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { hasPermission } from '@/types/rbac';
import type { Permission } from '@/types/rbac';

interface PermissionGuardProps {
  children: ReactNode;
  permission: Permission;
  fallback?: ReactNode;
  redirectTo?: string;
}

export function PermissionGuard({
  children,
  permission,
  fallback,
  redirectTo = '/dashboard',
}: PermissionGuardProps) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const allowed = hasPermission(user.role, permission);

  if (!allowed) {
    if (fallback) {
      return <>{fallback}</>;
    }
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
}
