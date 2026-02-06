import { UserRole } from './rbac';

export interface PlatformUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarInitials: string;
  lastActive: Date;
  status: 'active' | 'inactive';
}

export const DEMO_USERS: PlatformUser[] = [
  {
    id: 'user_admin_001',
    name: 'Adewale Okonkwo',
    email: 'demo@optimusai.ai',
    role: 'admin',
    avatarInitials: 'AO',
    lastActive: new Date(),
    status: 'active',
  },
  {
    id: 'user_manager_001',
    name: 'Funke Adeyemi',
    email: 'funke@optimusai.ai',
    role: 'campaign_manager',
    avatarInitials: 'FA',
    lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000),
    status: 'active',
  },
  {
    id: 'user_analyst_001',
    name: 'Chidi Nwosu',
    email: 'chidi@optimusai.ai',
    role: 'analyst',
    avatarInitials: 'CN',
    lastActive: new Date(Date.now() - 5 * 60 * 60 * 1000),
    status: 'active',
  },
];
