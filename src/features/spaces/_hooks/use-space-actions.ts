// [職責] 提供所有操作函式。
// 所有先前在 SpaceContextShell 中的操作函式都將移到這裡。
import { useCallback } from 'react';

import {
  createTask as createTaskFacade,
  updateTask as updateTaskFacade,
  deleteTask as deleteTaskFacade,
  authorizeSpaceTeam as authorizeSpaceTeamFacade,
  revokeSpaceTeam as revokeSpaceTeamFacade,
  grantIndividualSpaceAccess as grantIndividualSpaceAccessFacade,
  revokeIndividualSpaceAccess as revokeIndividualSpaceAccessFacade,
  mountCapabilities as mountCapabilitiesFacade,
  unmountCapability as unmountCapabilityFacade,
  updateSpaceSettings as updateSpaceSettingsFacade,
  deleteSpace as deleteSpaceFacade,
  createIssue as createIssueFacade,
  addCommentToIssue as addCommentToIssueFacade,
  createScheduleItem as createScheduleItemFacade,
} from '@/features/core/firebase/firestore/firestore.facade';
import { useLogger } from '@/features/spaces/_hooks/shell/use-logger';
import { 
  Space, 
  SpaceTask, 
  SpaceRole, 
  Capability, 
  SpaceLifecycleState, 
  Address, 
  ScheduleItem 
} from '@/types/domain';

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
  const createTask = useCallback(async (task: Omit<SpaceTask, 'id' | 'createdAt' | 'updatedAt'>) => 
    createTaskFacade(spaceId, task), [spaceId]);

  const updateTask = useCallback(async (taskId: string, updates: Partial<SpaceTask>) => 
    updateTaskFacade(spaceId, taskId, updates), [spaceId]);

  const deleteTask = useCallback(async (taskId: string) => 
    deleteTaskFacade(spaceId, taskId), [spaceId]);

  // Member management actions
  const authorizeSpaceTeam = useCallback(async (teamId: string) => 
    authorizeSpaceTeamFacade(spaceId, teamId), [spaceId]);

  const revokeSpaceTeam = useCallback(async (teamId: string) => 
    revokeSpaceTeamFacade(spaceId, teamId), [spaceId]);

  const grantIndividualSpaceAccess = useCallback(async (userId: string, role: SpaceRole, protocol?: string) => 
    grantIndividualSpaceAccessFacade(spaceId, userId, role, protocol), [spaceId]);

  const revokeIndividualSpaceAccess = useCallback(async (grantId: string) => 
    revokeIndividualSpaceAccessFacade(spaceId, grantId), [spaceId]);

  // Capability management
  const mountCapabilities = useCallback(async (capabilities: Capability[]) => 
    mountCapabilitiesFacade(spaceId, capabilities), [spaceId]);

  const unmountCapability = useCallback(async (capability: Capability) => 
    unmountCapabilityFacade(spaceId, capability), [spaceId]);

  // Space settings
  const updateSpaceSettings = useCallback(async (settings: { name: string; visibility: 'visible' | 'hidden'; lifecycleState: SpaceLifecycleState, address: Address }) => 
    updateSpaceSettingsFacade(spaceId, settings), [spaceId]);

  const deleteSpace = useCallback(async () => 
    deleteSpaceFacade(spaceId), [spaceId]);

  // Issue Management
  const createIssue = useCallback(async (title: string, type: 'technical' | 'financial', priority: 'high' | 'medium') => 
    createIssueFacade(spaceId, title, type, priority), [spaceId]);

  const addCommentToIssue = useCallback(async (issueId: string, author: string, content: string) => 
    addCommentToIssueFacade(spaceId, issueId, author, content), [spaceId]);

  // Schedule Management
  const createScheduleItem = useCallback(async (itemData: Omit<ScheduleItem, 'id' | 'createdAt'>) => 
    createScheduleItemFacade(itemData), []);

  return {
    logAuditEvent,
    createTask,
  };
};
