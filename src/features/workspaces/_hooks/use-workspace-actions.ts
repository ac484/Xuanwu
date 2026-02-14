// [職責] 提供所有操作函式。
// 所有先前在 WorkspaceContextShell 中的操作函式都將移到這裡。
import { useCallback } from 'react';
import { 
  Workspace, 
  WorkspaceTask, 
  WorkspaceRole, 
  Capability, 
  WorkspaceLifecycleState, 
  Address, 
  ScheduleItem 
} from '@/types/domain';
import {
  createTask as createTaskFacade,
  updateTask as updateTaskFacade,
  deleteTask as deleteTaskFacade,
  authorizeWorkspaceTeam as authorizeWorkspaceTeamFacade,
  revokeWorkspaceTeam as revokeWorkspaceTeamFacade,
  grantIndividualWorkspaceAccess as grantIndividualWorkspaceAccessFacade,
  revokeIndividualWorkspaceAccess as revokeIndividualWorkspaceAccessFacade,
  mountCapabilities as mountCapabilitiesFacade,
  unmountCapability as unmountCapabilityFacade,
  updateWorkspaceSettings as updateWorkspaceSettingsFacade,
  deleteWorkspace as deleteWorkspaceFacade,
  createIssue as createIssueFacade,
  addCommentToIssue as addCommentToIssueFacade,
  createScheduleItem as createScheduleItemFacade,
} from '@/infra/firebase/firestore/firestore.facade';
import { useLogger } from '@/features/workspaces/_hooks/shell/use-logger';

interface UseWorkspaceActionsProps {
  workspaceId: string;
  workspaceName?: string;
}

export const useWorkspaceActions = ({ workspaceId, workspaceName }: UseWorkspaceActionsProps) => {
  const { logAudit } = useLogger(workspaceId, workspaceName);

  const logAuditEvent = useCallback((action: string, detail: string, type: 'create' | 'update' | 'delete') => {
    logAudit(action, detail, type);
  }, [logAudit]);

  // Task specific actions
  const createTask = useCallback(async (task: Omit<WorkspaceTask, 'id' | 'createdAt' | 'updatedAt'>) => 
    createTaskFacade(workspaceId, task), [workspaceId]);

  const updateTask = useCallback(async (taskId: string, updates: Partial<WorkspaceTask>) => 
    updateTaskFacade(workspaceId, taskId, updates), [workspaceId]);

  const deleteTask = useCallback(async (taskId: string) => 
    deleteTaskFacade(workspaceId, taskId), [workspaceId]);

  // Member management actions
  const authorizeWorkspaceTeam = useCallback(async (teamId: string) => 
    authorizeWorkspaceTeamFacade(workspaceId, teamId), [workspaceId]);

  const revokeWorkspaceTeam = useCallback(async (teamId: string) => 
    revokeWorkspaceTeamFacade(workspaceId, teamId), [workspaceId]);

  const grantIndividualWorkspaceAccess = useCallback(async (userId: string, role: WorkspaceRole, protocol?: string) => 
    grantIndividualWorkspaceAccessFacade(workspaceId, userId, role, protocol), [workspaceId]);

  const revokeIndividualWorkspaceAccess = useCallback(async (grantId: string) => 
    revokeIndividualWorkspaceAccessFacade(workspaceId, grantId), [workspaceId]);

  // Capability management
  const mountCapabilities = useCallback(async (capabilities: Capability[]) => 
    mountCapabilitiesFacade(workspaceId, capabilities), [workspaceId]);

  const unmountCapability = useCallback(async (capability: Capability) => 
    unmountCapabilityFacade(workspaceId, capability), [workspaceId]);

  // Workspace settings
  const updateWorkspaceSettings = useCallback(async (settings: { name: string; visibility: 'visible' | 'hidden'; lifecycleState: WorkspaceLifecycleState, address: Address }) => 
    updateWorkspaceSettingsFacade(workspaceId, settings), [workspaceId]);

  const deleteWorkspace = useCallback(async () => 
    deleteWorkspaceFacade(workspaceId), [workspaceId]);

  // Issue Management
  const createIssue = useCallback(async (title: string, type: 'technical' | 'financial', priority: 'high' | 'medium') => 
    createIssueFacade(workspaceId, title, type, priority), [workspaceId]);

  const addCommentToIssue = useCallback(async (issueId: string, author: string, content: string) => 
    addCommentToIssueFacade(workspaceId, issueId, author, content), [workspaceId]);

  // Schedule Management
  const createScheduleItem = useCallback(async (itemData: Omit<ScheduleItem, 'id' | 'createdAt'>) => 
    createScheduleItemFacade(itemData), []);

  return {
    logAuditEvent,
    createTask,
    updateTask,
    deleteTask,
    authorizeWorkspaceTeam,
    revokeWorkspaceTeam,
    grantIndividualWorkspaceAccess,
    revokeIndividualWorkspaceAccess,
    mountCapabilities,
    unmountCapability,
    updateWorkspaceSettings,
    deleteWorkspace,
    createIssue,
    addCommentToIssue,
    createScheduleItem,
  };
};
