"use client";

import { useMemo } from "react";
import { useAccount } from "@/hooks/state/use-account";
import { useApp } from "@/hooks/state/use-app";
import { useWorkspace } from "@/features/workspaces/_context/workspace-context";

/**
 * @fileoverview useWorkspaceSchedule - Hook for filtering schedule data for the current workspace.
 * @description Encapsulates data filtering logic for the workspace-specific
 * schedule, keeping the entry component clean and focused on state and actions.
 */
export function useWorkspaceSchedule() {
  const { workspace } = useWorkspace();
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
    Object.values(schedule_items || {}).filter(item => item.workspaceId === workspace.id),
    [schedule_items, workspace.id]
  );
  
  return { localItems, orgMembers };
}
