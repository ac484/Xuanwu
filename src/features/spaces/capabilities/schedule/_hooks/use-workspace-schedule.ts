"use client";

import { useMemo, useContext } from "react";

import { WorkspaceContext } from "@/features/workspaces/_context/workspace-context";
import { useAccount } from "@/hooks/state/use-account";
import { useApp } from "@/hooks/state/use-app";

function useWorkspace() {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error("useWorkspace must be used within a WorkspaceProvider");
  }
  return context.state;
}

/**
 * @fileoverview useWorkspaceSchedule - Hook for filtering schedule data for the current workspace.
 * @description Encapsulates data filtering logic for the workspace-specific
 * schedule, keeping the entry component clean and focused on state and actions.
 */
export function useWorkspaceSchedule() {
  const { workspace } = useWorkspace() as any;
  const { state: appState } = useApp();
  const { state: accountState } = useAccount();
  const { schedule_items } = accountState;
  const { organizations, activeAccount } = appState;

  const activeOrg = useMemo(() =>
    activeAccount?.type === 'organization' ? organizations[activeAccount.id] : null,
    [organizations, activeAccount]
  );

  const orgMembers = useMemo(() => activeOrg?.members || [], [activeOrg]);

  const localItems = useMemo(() => 
    Object.values(schedule_items || {}).filter((item: any) => item.workspaceId === workspace.id),
    [schedule_items, workspace.id]
  );
  
  return { localItems, orgMembers };
}
