// [職責] 提供對外的單一入口 Hook。
// 它會整合 useContext 來取得狀態，並呼叫 useWorkspaceActions 來取得操作函式，最後將 state 和 actions 一併回傳。
import { useContext } from 'react';
import { WorkspaceContext, WorkspaceContextType } from '@/features/workspaces/_context/workspace-context';
import { useWorkspaceActions } from './use-workspace-actions';

export const useWorkspace = () => {
  const context = useContext(WorkspaceContext);

  if (!context) {
    throw new Error("useWorkspace must be used within a WorkspaceContextShell");
  }

  const { state, dispatch, eventBus, logAuditEvent } = context;
  const actions = useWorkspaceActions({ 
    workspaceId: state.workspace.id, 
    workspaceName: state.workspace.name 
  });

  return {
    ...state,
    dispatch,
    eventBus,
    logAuditEvent,
    actions,
  };
};

export const useOptionalWorkspace = () => {
  const context = useContext(WorkspaceContext);
  const actions = context ? useWorkspaceActions({
    workspaceId: context.state.workspace.id,
    workspaceName: context.state.workspace.name,
  }) : undefined;
  
  return context ? {
    ...context.state,
    dispatch: context.dispatch,
    eventBus: context.eventBus,
    logAuditEvent: context.logAuditEvent,
    actions,
  } : undefined;
};
