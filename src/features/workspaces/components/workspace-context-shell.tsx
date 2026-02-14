// [職責] 作為 Context 的提供者 (Provider)。
// 初始化 useReducer、EventBus，並使用 useWorkspaceSync Hook 啟動資料同步。
"use client";

import React, { useMemo, useReducer } from 'react';
import { Workspace } from '@/types/domain';
import { useAccount } from '@/hooks/state/use-account';
import { useFirebase } from '@/context/firebase-context';
import { Loader2 } from 'lucide-react';
import { WorkspaceEventBus } from '@/features/workspaces/_events/workspace-event-bus';
import { WorkspaceEventHandler } from '@/features/workspaces/_events/workspace-event-handler';
import { 
  WorkspaceContext, 
  localReducer, 
  WorkspaceState, 
  WorkspaceContextType 
} from '@/features/workspaces/_context/workspace-context';
import { useWorkspaceSync } from '@/features/workspaces/_hooks/use-workspace-sync';
import { useLogger } from '@/features/workspaces/_hooks/shell/use-logger';

interface WorkspaceContextShellProps {
  workspaceId: string;
  children: React.ReactNode;
}

export function WorkspaceContextShell({ workspaceId, children }: WorkspaceContextShellProps) {
  const { state: accountState } = useAccount();
  const { db } = useFirebase();
  const { workspaces, auditLogs } = accountState;
  const workspace = workspaces[workspaceId];

  const [localState, dispatch] = useReducer(localReducer, { tasks: {}, issues: {}, files: {} });

  const eventBus = useMemo(() => new WorkspaceEventBus(), [workspaceId]);
  const { logAudit } = useLogger(workspaceId, workspace?.name);

  useWorkspaceSync({ db, workspaceId, dispatch });

  const localAuditLogs = useMemo(() => {
    if (!auditLogs || !workspaceId) return [];
    return Object.values(auditLogs).filter(log => log.workspaceId === workspaceId);
  }, [auditLogs, workspaceId]);

  if (!workspace || !db) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center space-y-4 bg-background p-20">
        <div className="text-4xl animate-bounce">🐢</div>
        <div className="flex items-center gap-2 text-muted-foreground font-black uppercase text-[10px] tracking-widest">
          <Loader2 className="w-3 h-3 animate-spin" /> Entering logical space...
        </div>
      </div>
    );
  }

  const state: WorkspaceState = {
    workspace: { ...workspace, ...localState }, // Combine top-level doc with sub-collections
    ...localState,
    localAuditLogs,
    db,
    protocol: workspace.protocol || 'Default',
    scope: workspace.scope || [],
  };
  
  const contextValue: WorkspaceContextType = {
    state,
    dispatch,
    eventBus,
    logAuditEvent: (action, detail, type) => logAudit(action, detail, type),
  };

  return (
    <WorkspaceContext.Provider value={contextValue}>
      <WorkspaceEventHandler />
      {children}
    </WorkspaceContext.Provider>
  );
}
