"use client";

import { useMemo, useContext } from "react";

import { SpaceContext } from "@/features/spaces/_context/space-context";
import { useAccount } from "@/hooks/state/use-account";
import { useApp } from "@/hooks/state/use-app";

function useSpace() {
  const context = useContext(SpaceContext);
  if (!context) {
    throw new Error("useSpace must be used within a SpaceProvider");
  }
  return context.state;
}

/**
 * @fileoverview useSpaceSchedule - Hook for filtering schedule data for the current space.
 * @description Encapsulates data filtering logic for the space-specific
 * schedule, keeping the entry component clean and focused on state and actions.
 */
export function useSpaceSchedule() {
  const { space } = useSpace() as any;
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
