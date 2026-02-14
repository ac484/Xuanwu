// [職責] 定義 Context 物件、State 的型別定義和 Reducer 函式。
// 這將是純粹的狀態容器定義，不包含任何副作用或操作。
import { createContext, Dispatch } from 'react';
import { Workspace, AuditLog, WorkspaceTask, WorkspaceIssue, WorkspaceFile } from '@/types/domain';
import { WorkspaceEventBus } from '@/features/workspaces/_events/workspace-event-bus';
import { Firestore, QuerySnapshot } from 'firebase/firestore';

// State for sub-collections
export interface WorkspaceLocalState {
  tasks: Record<string, WorkspaceTask>;
  issues: Record<string, WorkspaceIssue>;
  files: Record<string, WorkspaceFile>;
}

// The complete state managed by the context
export interface WorkspaceState extends WorkspaceLocalState {
  workspace: Workspace;
  localAuditLogs: AuditLog[];
  db: Firestore | null;
  protocol: string;
  scope: string[];
}

// Action types for the reducer
export type LocalAction =
  | { type: 'SET_TASKS'; payload: QuerySnapshot }
  | { type: 'SET_ISSUES'; payload: QuerySnapshot }
  | { type: 'SET_FILES'; payload: QuerySnapshot }
  | { type: 'RESET_STATE' };

// The type for the context value
export interface WorkspaceContextType {
  state: WorkspaceState;
  dispatch: Dispatch<LocalAction>;
  eventBus: WorkspaceEventBus;
  logAuditEvent: (action: string, detail: string, type: 'create' | 'update' | 'delete') => void;
}

// The React Context object
export const WorkspaceContext = createContext<WorkspaceContextType | null>(null);

// Reducer helper function
export const snapshotToRecord = <T extends { id: string }>(snap: QuerySnapshot): Record<string, T> => {
  const record: Record<string, T> = {};
  if (snap && typeof snap.forEach === 'function') {
    snap.forEach(doc => {
      record[doc.id] = { id: doc.id, ...doc.data() } as T;
    });
  }
  return record;
};

// Reducer for sub-collections state
export const localReducer = (state: WorkspaceLocalState, action: LocalAction): WorkspaceLocalState => {
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
