"use client";

import { useMemo } from "react";

import { subDays, isFuture, isWithinInterval, startOfDay, endOfDay } from 'date-fns';

import { useOptionalSpace } from "@/features/spaces";
import { useAccount } from "@/hooks/state/use-account";
import { useApp } from "@/hooks/state/use-app";
import { ScheduleItem } from "@/types/domain";

/**
 * @fileoverview useScheduleData - Unified hook for fetching schedule data.
 * @description This hook is context-aware. It takes a `viewMode` and fetches
 * either organization-wide data (from `useAccount`) or space-specific data
 * (from `useSpace`), returning a consistent data shape for the UI.
 */
export function useScheduleData(viewMode: 'organization' | 'space') {
  const { state: appState } = useApp();
  const { state: accountState } = useAccount();
  const spaceContext = useOptionalSpace();

  const { organizations, activeAccount } = appState;

  const activeOrg = useMemo(() =>
    activeAccount?.type === 'organization' ? organizations[activeAccount.id] : null,
    [organizations, activeAccount]
  );
  const orgMembers = useMemo(() => activeOrg?.members || [], [activeOrg]);

  // Determine the source of truth based on viewMode
  const allRawItems = useMemo(() => {
    if (viewMode === 'organization') {
      return Object.values(accountState.schedule_items || {});
    }
    // In space view, we get items pre-filtered by the AccountContext
    // but we need to re-filter them for the specific space from the context.
    if (viewMode === 'space' && spaceContext) {
        return Object.values(accountState.schedule_items || {}).filter(item => item.spaceId === spaceContext.state.space.id);
    }
    return [];
  }, [viewMode, accountState.schedule_items, spaceContext]);

  const allItems: ScheduleItem[] = useMemo(() => {
    return allRawItems.map(item => ({
      ...item,
      spaceName: accountState.spaces[item.spaceId]?.name || "Unknown",
    } as ScheduleItem));
  }, [allRawItems, accountState.spaces]);


  // Organization-specific derived data
  const pendingProposals = useMemo(() => {
    if (viewMode !== 'organization') return [];
    return allItems.filter(item => item.status === 'PROPOSAL');
  }, [allItems, viewMode]);

  const decisionHistory = useMemo(() => {
    if (viewMode !== 'organization') return [];
    const sevenDaysAgo = subDays(new Date(), 7);
    return allItems
      .filter(item => 
        (item.status === 'OFFICIAL' || item.status === 'REJECTED') && 
        item.updatedAt?.toDate() > sevenDaysAgo
      )
      .sort((a,b) => (b.updatedAt?.seconds || 0) - (a.updatedAt?.seconds || 0));
  }, [allItems, viewMode]);

  const upcomingEvents = useMemo(() => {
    if (viewMode !== 'organization') return [];
    return allItems
      .filter(item => 
        item.status === 'OFFICIAL' && 
        item.startDate &&
        isFuture(item.startDate.toDate())
      )
      .map(item => ({
        ...item,
        members: orgMembers,
      }))
      .sort((a,b) => (a.startDate?.seconds || 0) - (b.startDate?.seconds || 0));
  }, [allItems, orgMembers, viewMode]);

  const presentEvents = useMemo(() => {
    if (viewMode !== 'organization') return [];
    const today = new Date();
    return allItems
      .filter(item => {
          if (item.status !== 'OFFICIAL' || !item.startDate) return false;
          const start = item.startDate.toDate();
          const end = item.endDate?.toDate() || start;
          return isWithinInterval(today, { start: startOfDay(start), end: endOfDay(end) });
      })
      .map(item => ({
        ...item,
        members: orgMembers,
      }))
      .sort((a,b) => (a.startDate?.seconds || 0) - (b.startDate?.seconds || 0));
  }, [allItems, orgMembers, viewMode]);
  
  return {
    allItems, // For the calendar grid in both views
    orgMembers, // Needed for assignees in both views
    // Organization-specific data
    pendingProposals,
    decisionHistory,
    upcomingEvents,
    presentEvents,
  };
}
