"use client";

import { useMemo } from "react";

import { useSpace } from "@/features/spaces";
import { useAccount } from "@/hooks/state/use-account";
import { useApp } from "@/hooks/state/use-app";

/**
 * @fileoverview useSpaceSchedule - Hook for filtering schedule data for the current space.
 * @description Encapsulates data filtering logic for the space-specific
 * schedule, keeping the entry component clean and focused on state and actions.
 */
export function useSpaceSchedule() {
  const { state } = useSpace();
  const { space } = state;
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
    Object.values(schedule_items || {}).filter((item: any) => item.spaceId === space.id),
    [schedule_items, space.id]
  );
  
  return { localItems, orgMembers };
}
