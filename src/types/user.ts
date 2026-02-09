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

export const PLATFORM_USERS: PlatformUser[] = [
  {
    id: '43683902-22e6-4b54-b847-119886bc8b27',
    name: 'Adewale Okonkwo',
    email: 'adewale.okonkwo@ucapital.com',
    role: 'admin',
    avatarInitials: 'AO',
    lastActive: new Date(),
    status: 'active',
  },
  {
    id: '05195125-1035-41e3-9133-e81042f44cbc',
    name: 'Funke Adeyemi',
    email: 'funke.adeyemi@ucapital.com',
    role: 'admin',
    avatarInitials: 'FA',
    lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000),
    status: 'active',
  },
  {
    id: '59a541dc-63b3-4d61-bb76-08c8226f53c6',
    name: 'Chidi Nwosu',
    email: 'chidi.nwosu@ucapital.com',
    role: 'admin',
    avatarInitials: 'CN',
    lastActive: new Date(Date.now() - 5 * 60 * 60 * 1000),
    status: 'active',
  },
  {
    id: '80e2e512-8774-4496-8782-65fae22d1b59',
    name: 'Zainab Bello',
    email: 'zainab.bello@ucapital.com',
    role: 'admin',
    avatarInitials: 'ZB',
    lastActive: new Date(Date.now() - 3 * 60 * 60 * 1000),
    status: 'active',
  },
];
