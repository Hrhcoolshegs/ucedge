import { supabase, type ActivityLog } from '@/lib/supabase';
import type { UserRole } from '@/types/rbac';

export type ActivityActionType =
  | 'login'
  | 'logout'
  | 'campaign_create'
  | 'campaign_launch'
  | 'campaign_update'
  | 'campaign_delete'
  | 'journey_create'
  | 'journey_update'
  | 'journey_delete'
  | 'journey_publish'
  | 'segment_create'
  | 'segment_modify'
  | 'segment_delete'
  | 'data_export'
  | 'approval_submit'
  | 'approval_approve'
  | 'approval_reject'
  | 'settings_change'
  | 'user_action'
  | 'consent_update'
  | 'customer_view'
  | 'report_generate';

interface LogActivityParams {
  userId: string;
  userName: string;
  userRole: UserRole;
  actionType: ActivityActionType;
  resource?: string;
  resourceId?: string;
  details?: Record<string, any>;
  sessionId?: string;
}

class ActivityLogger {
  private sessionId: string;

  constructor() {
    this.sessionId = this.generateSessionId();
  }

  private generateSessionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
  }

  private async getClientInfo() {
    return {
      ip_address: 'client-side',
      user_agent: navigator.userAgent,
    };
  }

  async log(params: LogActivityParams): Promise<void> {
    try {
      const clientInfo = await this.getClientInfo();

      const activityLog: ActivityLog = {
        user_id: params.userId,
        user_name: params.userName,
        user_role: params.userRole,
        action_type: params.actionType,
        resource: params.resource,
        resource_id: params.resourceId,
        details: params.details || {},
        ip_address: clientInfo.ip_address,
        user_agent: clientInfo.user_agent,
        session_id: params.sessionId || this.sessionId,
        timestamp: new Date().toISOString(),
      };

      if (!supabase) return;

      const { error } = await supabase
        .from('activity_logs')
        .insert(activityLog);

      if (error) {
        console.error('Failed to log activity:', error);
      }
    } catch (error) {
      console.error('Activity logging error:', error);
    }
  }

  async logLogin(userId: string, userName: string, userRole: UserRole): Promise<void> {
    await this.log({
      userId,
      userName,
      userRole,
      actionType: 'login',
      details: { timestamp: new Date().toISOString() },
    });
  }

  async logLogout(userId: string, userName: string, userRole: UserRole): Promise<void> {
    await this.log({
      userId,
      userName,
      userRole,
      actionType: 'logout',
      details: { timestamp: new Date().toISOString() },
    });
  }

  async logCampaignAction(
    userId: string,
    userName: string,
    userRole: UserRole,
    action: 'create' | 'launch' | 'update' | 'delete',
    campaignId: string,
    campaignName: string
  ): Promise<void> {
    await this.log({
      userId,
      userName,
      userRole,
      actionType: `campaign_${action}` as ActivityActionType,
      resource: 'campaign',
      resourceId: campaignId,
      details: { campaignName },
    });
  }

  async logJourneyAction(
    userId: string,
    userName: string,
    userRole: UserRole,
    action: 'create' | 'update' | 'delete' | 'publish',
    journeyId: string,
    journeyName: string
  ): Promise<void> {
    await this.log({
      userId,
      userName,
      userRole,
      actionType: `journey_${action}` as ActivityActionType,
      resource: 'journey',
      resourceId: journeyId,
      details: { journeyName },
    });
  }

  async logSegmentAction(
    userId: string,
    userName: string,
    userRole: UserRole,
    action: 'create' | 'modify' | 'delete',
    segmentId: string,
    segmentName: string
  ): Promise<void> {
    await this.log({
      userId,
      userName,
      userRole,
      actionType: `segment_${action}` as ActivityActionType,
      resource: 'segment',
      resourceId: segmentId,
      details: { segmentName },
    });
  }

  async logDataExport(
    userId: string,
    userName: string,
    userRole: UserRole,
    exportType: string,
    recordCount: number,
    containsPII: boolean
  ): Promise<void> {
    await this.log({
      userId,
      userName,
      userRole,
      actionType: 'data_export',
      resource: 'export',
      details: { exportType, recordCount, containsPII },
    });
  }

  async logApprovalAction(
    userId: string,
    userName: string,
    userRole: UserRole,
    action: 'submit' | 'approve' | 'reject',
    approvalId: string,
    approvalType: string
  ): Promise<void> {
    await this.log({
      userId,
      userName,
      userRole,
      actionType: `approval_${action}` as ActivityActionType,
      resource: 'approval',
      resourceId: approvalId,
      details: { approvalType },
    });
  }
}

export const activityLogger = new ActivityLogger();
