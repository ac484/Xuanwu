// [職責] 作為 Context 的提供者 (Provider)。
// 初始化 useReducer、EventBus，並使用 useSpaceSync Hook 啟動資料同步。
"use client";

import React, { useMemo, useReducer } from 'react';
import { Space } from '@/types/domain';
import { useAccount } from '@/hooks/state/use-account';
import { useFirebase } from '@/context/firebase-context';
import { Loader2 } from 'lucide-react';
import { SpaceEventBus } from '@/features/spaces/_events/space-event-bus';
import { SpaceEventHandler } from '@/features/spaces/_events/space-event-handler';
import { 
  SpaceContext, 
  localReducer, 
  SpaceState, 
  SpaceContextType 
} from '@/features/spaces/_context/space-context';
import { useSpaceSync } from '@/features/spaces/_hooks/use-space-sync';
import { useLogger } from '@/features/spaces/_hooks/shell/use-logger';

interface SpaceContextShellProps {
  spaceId: string;
  children: React.ReactNode;
}

export function SpaceContextShell({ spaceId, children }: SpaceContextShellProps) {
  const { state: accountState } = useAccount();
  const { db } = useFirebase();
  const { spaces, auditLogs } = accountState;
  const space = spaces[spaceId];

  const [localState, dispatch] = useReducer(localReducer, { tasks: {}, issues: {}, files: {} });

  const eventBus = useMemo(() => new SpaceEventBus(), [spaceId]);
  const { logAudit } = useLogger(spaceId, space?.name);

  useSpaceSync({ db, spaceId, dispatch });

  const localAuditLogs = useMemo(() => {
    if (!auditLogs || !spaceId) return [];
    return Object.values(auditLogs).filter(log => log.spaceId === spaceId);
  }, [auditLogs, spaceId]);

  if (!space || !db) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center space-y-4 bg-background p-20">
        <div className="text-4xl animate-bounce">🐢</div>
        <div className="flex items-center gap-2 text-muted-foreground font-black uppercase text-[10px] tracking-widest">
          <Loader2 className="w-3 h-3 animate-spin" /> Entering logical space...
        </div>
      </div>
    );
  }

  const state: SpaceState = {
    space: { ...space, ...localState }, // Combine top-level doc with sub-collections
    ...localState,
    localAuditLogs,
    db,
    protocol: space.protocol || 'Default',
    scope: space.scope || [],
  };
  
  const contextValue: SpaceContextType = {
    state,
    dispatch,
    eventBus,
    logAuditEvent: (action, detail, type) => logAudit(action, detail, type),
  };

  return (
    <SpaceContext.Provider value={contextValue}>
      <SpaceEventHandler />
      {children}
    </SpaceContext.Provider>
  );
}
