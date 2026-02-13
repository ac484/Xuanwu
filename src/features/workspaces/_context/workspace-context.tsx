// [職責] 提供單一工作區的完整上下文，包括其所有子集合和操作
"use client";

import React, { createContext, useContext, useMemo, useCallback, useReducer, useEffect } from 'react';
import { Workspace, AuditLog, WorkspaceTask, WorkspaceRole, Capability, WorkspaceLifecycleState, ScheduleItem, Location, Address, WorkspaceIssue, WorkspaceFile } from '@/types/domain';
import { useLogger } from '@/features/workspaces/_hooks/shell/use-logger';
import { WorkspaceEventBus } from '@/features/workspaces/_events/workspace-event-bus';
import { Firestore, collection, onSnapshot, query, QuerySnapshot } from 'firebase/firestore';
import { useAccount } from '@/hooks/state/use-account';
import { useFirebase } from '@/context/firebase-context';
import { Loader2 } from 'lucide-react';
import { WorkspaceEventHandler } from '@/features/workspaces/_events/workspace-event-handler';
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


// ============================================================================
// 1. CONTEXT (THE DATA CONTAINER / THE CHANNEL)
// ============================================================================

// State and Action Types for sub-collections
interface WorkspaceLocalState {
  tasks: Record<string, WorkspaceTask>;
  issues: Record<string, WorkspaceIssue>;
  files: Record<string, WorkspaceFile>;
}

type LocalAction =
  | { type: 'SET_TASKS'; payload: QuerySnapshot }
  | { type: 'SET_ISSUES'; payload: QuerySnapshot }
  | { type: 'SET_FILES'; payload: QuerySnapshot }
  | { type: 'RESET_STATE' };

interface WorkspaceContextType extends WorkspaceLocalState {
  workspace: Workspace;
  localAuditLogs: AuditLog[];
  logAuditEvent: (action: string, detail: string, type: 'create' | 'update' | 'delete') => void;
  eventBus: WorkspaceEventBus;
  protocol: string;
  scope: string[];
  db: Firestore;
  // Task specific actions
  createTask: (task: Omit<WorkspaceTask, 'id' | 'createdAt' | 'updatedAt'>) => Promise<string>;
  updateTask: (taskId: string, updates: Partial<WorkspaceTask>) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  // Member management actions
  authorizeWorkspaceTeam: (teamId: string) => Promise<void>;
  revokeWorkspaceTeam: (teamId: string) => Promise<void>;
  grantIndividualWorkspaceAccess: (userId: string, role: WorkspaceRole, protocol?: string) => Promise<void>;
  revokeIndividualWorkspaceAccess: (grantId: string) => Promise<void>;
  // Capability management
  mountCapabilities: (capabilities: Capability[]) => Promise<void>;
  unmountCapability: (capability: Capability) => Promise<void>;
  // Workspace settings
  updateWorkspaceSettings: (settings: { name: string; visibility: 'visible' | 'hidden'; lifecycleState: WorkspaceLifecycleState, address: Address }) => Promise<void>;
  deleteWorkspace: () => Promise<void>;
  // Issue Management
  createIssue: (title: string, type: 'technical' | 'financial', priority: 'high' | 'medium') => Promise<void>;
  addCommentToIssue: (issueId: string, author: string, content: string) => Promise<void>;
  // Schedule Management
  createScheduleItem: (itemData: Omit<ScheduleItem, 'id' | 'createdAt' | 'updatedAt'>) => Promise<string>;
}

const WorkspaceContext = createContext<WorkspaceContextType | null>(null);

// Reducer for sub-collections
const snapshotToRecord = <T extends { id: string }>(snap: QuerySnapshot): Record<string, T> => {
  const record: Record<string, T> = {};
  if (snap && typeof snap.forEach === 'function') {
    snap.forEach(doc => {
      record[doc.id] = { id: doc.id, ...doc.data() } as T;
    });
  }
  return record;
};

const localReducer = (state: WorkspaceLocalState, action: LocalAction): WorkspaceLocalState => {
    switch (action.type) {
        case 'RESET_STATE':
            return { tasks: {}, issues: {}, files: {} };
        case 'SET_TASKS':
            return { ...state, tasks: snapshotToRecord(action.payload) };
        case 'SET_ISSUES':
            return { ...state, issues: snapshotToRecord(action.payload) };
        case 'SET_FILES':
            return { ...state, files: snapshotToRecord(action.payload) };
        default:
            return state;
    }
};

// ============================================================================
// 2. CONTEXT SHELL (THE ENVIRONMENT SUPPLIER)
// ============================================================================
export function WorkspaceContextShell({ workspaceId, children }: { workspaceId: string, children: React.ReactNode }) {
  const { state: accountState } = useAccount();
  const { db } = useFirebase();
  const { workspaces, auditLogs } = accountState;
  const workspace = workspaces[workspaceId];

  const [localState, localDispatch] = useReducer(localReducer, { tasks: {}, issues: {}, files: {} });

  const { logAudit } = useLogger(workspaceId, workspace?.name);
  const eventBus = useMemo(() => new WorkspaceEventBus(), [workspaceId]);

  useEffect(() => {
    if (!db || !workspaceId) {
      localDispatch({ type: 'RESET_STATE' });
      return;
    }
    const unsubs: (() => void)[] = [];
    unsubs.push(onSnapshot(query(collection(db, "workspaces", workspaceId, "tasks")), (snap) => localDispatch({ type: 'SET_TASKS', payload: snap })));
    unsubs.push(onSnapshot(query(collection(db, "workspaces", workspaceId, "issues")), (snap) => localDispatch({ type: 'SET_ISSUES', payload: snap })));
    unsubs.push(onSnapshot(query(collection(db, "workspaces", workspaceId, "files")), (snap) => localDispatch({ type: 'SET_FILES', payload: snap })));
    
    return () => unsubs.forEach(unsub => unsub());
  }, [db, workspaceId]);


  const localAuditLogs = useMemo(() => {
    if (!auditLogs || !workspaceId) return [];
    return Object.values(auditLogs).filter(log => log.workspaceId === workspaceId);
  }, [auditLogs, workspaceId]);
  
  const logAuditEvent = useCallback((action: string, detail: string, type: 'create' | 'update' | 'delete') => {
    logAudit(action, detail, type);
  }, [logAudit]);

  const createTask = useCallback(async (task: Omit<WorkspaceTask, 'id' | 'createdAt' | 'updatedAt'>) => createTaskFacade(workspaceId, task), [workspaceId]);
  const updateTask = useCallback(async (taskId: string, updates: Partial<WorkspaceTask>) => updateTaskFacade(workspaceId, taskId, updates), [workspaceId]);
  const deleteTask = useCallback(async (taskId: string) => deleteTaskFacade(workspaceId, taskId), [workspaceId]);
  
  const authorizeWorkspaceTeam = useCallback(async (teamId: string) => authorizeWorkspaceTeamFacade(workspaceId, teamId), [workspaceId]);
  const revokeWorkspaceTeam = useCallback(async (teamId: string) => revokeWorkspaceTeamFacade(workspaceId, teamId), [workspaceId]);
  const grantIndividualWorkspaceAccess = useCallback(async (userId: string, role: WorkspaceRole, protocol?: string) => grantIndividualWorkspaceAccessFacade(workspaceId, userId, role, protocol), [workspaceId]);
  const revokeIndividualWorkspaceAccess = useCallback(async (grantId: string) => revokeIndividualWorkspaceAccessFacade(workspaceId, grantId), [workspaceId]);
  
  const mountCapabilities = useCallback(async (capabilities: Capability[]) => mountCapabilitiesFacade(workspaceId, capabilities), [workspaceId]);
  const unmountCapability = useCallback(async (capability: Capability) => unmountCapabilityFacade(workspaceId, capability), [workspaceId]);
  
  const updateWorkspaceSettings = useCallback(async (settings: { name: string; visibility: 'visible' | 'hidden'; lifecycleState: WorkspaceLifecycleState, address: Address }) => updateWorkspaceSettingsFacade(workspaceId, settings), [workspaceId]);
  const deleteWorkspace = useCallback(async () => deleteWorkspaceFacade(workspaceId), [workspaceId]);

  const createIssue = useCallback(async (title: string, type: 'technical' | 'financial', priority: 'high' | 'medium') => createIssueFacade(workspaceId, title, type, priority), [workspaceId]);
  const addCommentToIssue = useCallback(async (issueId: string, author: string, content: string) => addCommentToIssueFacade(workspaceId, issueId, author, content), [workspaceId]);

  const createScheduleItem = useCallback(async (itemData: Omit<ScheduleItem, 'id' | 'createdAt'>) => createScheduleItemFacade(itemData), []);


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

  const value: WorkspaceContextType = {
    workspace: { ...workspace, ...localState }, // Combine top-level doc with sub-collections
    ...localState,
    localAuditLogs,
    logAuditEvent,
    eventBus,
    protocol: workspace.protocol || 'Default',
    scope: workspace.scope || [],
    db,
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

  return (
    <WorkspaceContext.Provider value={value}>
      <WorkspaceEventHandler />
      {children}
    </WorkspaceContext.Provider>
  );
}


// ============================================================================
// 3. HOOKS (THE STATE CONSUMERS)
// ============================================================================
export function useWorkspace() {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error("useWorkspace must be used within a WorkspaceContextShell");
  }
  return context;
}

export function useOptionalWorkspace() {
  const context = useContext(WorkspaceContext);
  return context;
}
