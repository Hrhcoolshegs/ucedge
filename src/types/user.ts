import { UserRole } from './rbac';

export interface PlatformUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarInitials: string;
  workspace: string;
  workspaceDescription: string;
  entity: string;
  entityShort: string;
  entityDescription: string;
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
    workspace: 'Group Oversight',
    workspaceDescription: 'Cross-business monitoring, approvals & compliance',
    entity: 'United Capital Investment Banking',
    entityShort: 'Investment Banking',
    entityDescription: 'Advisory, capital raising & structured finance',
    lastActive: new Date(),
    status: 'active',
  },
  {
    id: '05195125-1035-41e3-9133-e81042f44cbc',
    name: 'Funke Adeyemi',
    email: 'funke.adeyemi@ucapital.com',
    role: 'admin',
    avatarInitials: 'FA',
    workspace: 'Customer Growth',
    workspaceDescription: 'Campaigns, journeys & customer acquisition',
    entity: 'United Capital Microfinance Bank',
    entityShort: 'Microfinance Bank',
    entityDescription: 'Retail banking, micro-lending & financial inclusion',
    lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000),
    status: 'active',
  },
  {
    id: '59a541dc-63b3-4d61-bb76-08c8226f53c6',
    name: 'Chidi Nwosu',
    email: 'chidi.nwosu@ucapital.com',
    role: 'admin',
    avatarInitials: 'CN',
    workspace: 'Analytics & Insights',
    workspaceDescription: 'Reports, dashboards & data intelligence',
    entity: 'United Capital Asset Management',
    entityShort: 'Asset Management',
    entityDescription: 'Fund management, portfolio advisory & wealth solutions',
    lastActive: new Date(Date.now() - 5 * 60 * 60 * 1000),
    status: 'active',
  },
  {
    id: '80e2e512-8774-4496-8782-65fae22d1b59',
    name: 'Zainab Bello',
    email: 'zainab.bello@ucapital.com',
    role: 'admin',
    avatarInitials: 'ZB',
    workspace: 'Relationship & Deals',
    workspaceDescription: 'Portfolio management, deals & client relations',
    entity: 'United Capital Securities',
    entityShort: 'Securities',
    entityDescription: 'Stockbroking, trading & securities dealing',
    lastActive: new Date(Date.now() - 3 * 60 * 60 * 1000),
    status: 'active',
  },
];
