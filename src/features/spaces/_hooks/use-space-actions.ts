// [職責] 提供所有操作函式。
// 所有先前在 SpaceContextShell 中的操作函式都將移到這裡。
import { useCallback } from 'react';

import {
  createTask,
  updateTask,
  deleteTask,
  authorizeSpaceTeam,
  revokeSpaceTeam,
  grantIndividualSpaceAccess,
  revokeIndividualSpaceAccess,
  mountCapabilities,
  unmountCapability,
  updateSpaceSettings,
  deleteSpace,
  createIssue,
  addCommentToIssue,
} from '@/features/spaces/services/space.service';
import { createScheduleItem } from '@/features/account/services/account.service';
import { useLogger } from '@/features/spaces/_hooks/shell/use-logger';
import {
  Space,
  SpaceTask,
  SpaceRole,
  Capability,
  SpaceLifecycleState,
  Address,
  ScheduleItem
} from '@/types/space';

interface UseSpaceActionsProps {
  spaceId: string;
  spaceName?: string;
}

export const useSpaceActions = ({ spaceId, spaceName }: UseSpaceActionsProps) => {
  const { logAudit } = useLogger(spaceId, spaceName);

  const logAuditEvent = useCallback((action: string, detail: string, type: 'create' | 'update' | 'delete') => {
    logAudit(action, detail, type);
  }, [logAudit]);

  // Task specific actions
  const createTaskAction = useCallback(async (task: Omit<SpaceTask, 'id' | 'createdAt' | 'updatedAt'>) => 
    createTask(spaceId, task), [spaceId]);

  const updateTaskAction = useCallback(async (taskId: string, updates: Partial<SpaceTask>) => 
    updateTask(spaceId, taskId, updates), [spaceId]);

  const deleteTaskAction = useCallback(async (taskId: string) => 
    deleteTask(spaceId, taskId), [spaceId]);

  // Member management actions
  const authorizeSpaceTeamAction = useCallback(async (teamId: string) => 
    authorizeSpaceTeam(spaceId, teamId), [spaceId]);

  const revokeSpaceTeamAction = useCallback(async (teamId: string) => 
    revokeSpaceTeam(spaceId, teamId), [spaceId]);

  const grantIndividualSpaceAccessAction = useCallback(async (userId: string, role: SpaceRole, protocol?: string) => 
    grantIndividualSpaceAccess(spaceId, userId, role, protocol), [spaceId]);

  const revokeIndividualSpaceAccessAction = useCallback(async (grantId: string) => 
    revokeIndividualSpaceAccess(spaceId, grantId), [spaceId]);

  // Capability management
  const mountCapabilitiesAction = useCallback(async (capabilities: Capability[]) => 
    mountCapabilities(spaceId, capabilities), [spaceId]);

  const unmountCapabilityAction = useCallback(async (capability: Capability) => 
    unmountCapability(spaceId, capability), [spaceId]);

  // Space settings
  const updateSpaceSettingsAction = useCallback(async (settings: { name: string; visibility: 'visible' | 'hidden'; lifecycleState: SpaceLifecycleState, address: Address }) => 
    updateSpaceSettings(spaceId, settings), [spaceId]);

  const deleteSpaceAction = useCallback(async () => 
    deleteSpace(spaceId), [spaceId]);

  // Issue Management
  const createIssueAction = useCallback(async (title: string, type: 'technical' | 'financial', priority: 'high' | 'medium') => 
    createIssue(spaceId, title, type, priority), [spaceId]);

  const addCommentToIssueAction = useCallback(async (issueId: string, author: string, content: string) => 
    addCommentToIssue(spaceId, issueId, author, content), [spaceId]);

  // Schedule Management
  const createScheduleItemAction = useCallback(async (itemData: Omit<ScheduleItem, 'id' | 'createdAt'>) => 
    createScheduleItem(itemData), []);

  return {
    logAuditEvent,
    createTask: createTaskAction,
    updateTask: updateTaskAction,
    deleteTask: deleteTaskAction,
    authorizeSpaceTeam: authorizeSpaceTeamAction,
    revokeSpaceTeam: revokeSpaceTeamAction,
    grantIndividualSpaceAccess: grantIndividualSpaceAccessAction,
    revokeIndividualSpaceAccess: revokeIndividualSpaceAccessAction,
    mountCapabilities: mountCapabilitiesAction,
    unmountCapability: unmountCapabilityAction,
    updateSpaceSettings: updateSpaceSettingsAction,
    deleteSpace: deleteSpaceAction,
    createIssue: createIssueAction,
    addCommentToIssue: addCommentToIssueAction,
    createScheduleItem: createScheduleItemAction,
  };
};
