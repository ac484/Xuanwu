"use client";

import React, { createContext, useReducer, useEffect, ReactNode } from 'react';
import { useFirebase } from "@/context/firebase-context";
import { collection, query, where, onSnapshot, QuerySnapshot, orderBy, limit } from "firebase/firestore";
import { DailyLog, AuditLog, PartnerInvite, ScheduleItem } from '@/types/domain';
import { Space } from '@/types/space';
import { useApp } from '@/hooks/state/use-app';

// State and Action Types
interface AccountState {
  spaces: Record<string, Space>;
  dailyLogs: Record<string, DailyLog>;
  auditLogs: Record<string, AuditLog>;
  invites: Record<string, PartnerInvite>;
  schedule_items: Record<string, ScheduleItem>;
}

type Action =
  | { type: 'SET_SPACES'; payload: QuerySnapshot }
  | { type: 'SET_DAILY_LOGS'; payload: QuerySnapshot }
  | { type: 'SET_AUDIT_LOGS'; payload: QuerySnapshot }
  | { type: 'SET_INVITES'; payload: QuerySnapshot }
  | { type: 'SET_SCHEDULE_ITEMS'; payload: QuerySnapshot }
  | { type: 'RESET_STATE' };

// Initial State
const initialState: AccountState = {
  spaces: {},
  dailyLogs: {},
  auditLogs: {},
  invites: {},
  schedule_items: {},
};

function snapshotToRecord<T extends { id: string }>(snap: QuerySnapshot): Record<string, T> {
    const record: Record<string, T> = {};
    if (snap && typeof snap.forEach === 'function') {
        snap.forEach(doc => {
        record[doc.id] = { id: doc.id, ...doc.data() } as T;
        });
    }
    return record;
}

// Reducer
const accountReducer = (state: AccountState, action: Action): AccountState => {
  switch (action.type) {
    case 'RESET_STATE':
        return initialState;

    case 'SET_SPACES': {
        if (!action.payload?.docs) return { ...state, spaces: {} };
        const newSpaces = snapshotToRecord<Space>(action.payload);
        const updatedSpaces = { ...state.spaces };
        Object.keys(newSpaces).forEach(id => {
            updatedSpaces[id] = {
                ...(state.spaces[id] || {}), 
                ...newSpaces[id], 
            };
        });
        Object.keys(state.spaces).forEach(id => {
          if (!newSpaces[id]) {
            delete updatedSpaces[id];
          }
        })
        return { ...state, spaces: updatedSpaces };
    }
    
    case 'SET_DAILY_LOGS':
        if (!action.payload?.docs) return state;
        return { ...state, dailyLogs: snapshotToRecord(action.payload) };

    case 'SET_AUDIT_LOGS':
        if (!action.payload?.docs) return state;
        return { ...state, auditLogs: snapshotToRecord(action.payload) };
        
    case 'SET_INVITES':
        if (!action.payload?.docs) return state;
        return { ...state, invites: snapshotToRecord(action.payload) };
    
    case 'SET_SCHEDULE_ITEMS':
        if (!action.payload?.docs) return { ...state, schedule_items: {} };
        return { ...state, schedule_items: snapshotToRecord(action.payload) };

    default:
      return state;
  }
};


// Context
export const AccountContext = createContext<{ state: AccountState; dispatch: React.Dispatch<Action> } | null>(null);

// Provider
export const AccountProvider = ({ children }: { children: ReactNode }) => {
    const { db } = useFirebase();
    const { state: appState } = useApp();
    const { activeAccount } = appState;
    const [state, dispatch] = useReducer(accountReducer, initialState);

    useEffect(() => {
        if (!activeAccount?.id || !db) {
            dispatch({ type: 'RESET_STATE' });
            return;
        };

        const unsubs: (() => void)[] = [];

        if (activeAccount.type === 'organization') {
            const dailyLogsQuery = query(collection(db, "organizations", activeAccount.id, "dailyLogs"), orderBy("recordedAt", "desc"), limit(50));
            unsubs.push(onSnapshot(dailyLogsQuery, (snap) => dispatch({ type: 'SET_DAILY_LOGS', payload: snap })));

            const auditLogsQuery = query(collection(db, "organizations", activeAccount.id, "auditLogs"), orderBy("recordedAt", "desc"), limit(50));
            unsubs.push(onSnapshot(auditLogsQuery, (snap) => dispatch({ type: 'SET_AUDIT_LOGS', payload: snap })));
            
            const invitesQuery = query(collection(db, "organizations", activeAccount.id, "invites"), orderBy("invitedAt", "desc"));
            unsubs.push(onSnapshot(invitesQuery, (snap) => dispatch({ type: 'SET_INVITES', payload: snap })));

            const scheduleQuery = query(collection(db, "organizations", activeAccount.id, "schedule_items"), orderBy("createdAt", "desc"));
            unsubs.push(onSnapshot(scheduleQuery, (snap) => dispatch({ type: 'SET_SCHEDULE_ITEMS', payload: snap })));
        }
        
        const spQuery = query(collection(db, "spaces"), where("dimensionId", "==", activeAccount.id));
        unsubs.push(onSnapshot(spQuery, (snap) => dispatch({ type: 'SET_SPACES', payload: snap })));
        
        return () => {
            unsubs.forEach(unsub => unsub());
        };

    }, [activeAccount, db]);

    return (
        <AccountContext.Provider value={{ state, dispatch }}>
        {children}
        </AccountContext.Provider>
    );
};
