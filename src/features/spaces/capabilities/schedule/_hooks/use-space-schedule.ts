"use client";

import { useMemo } from 'react';

import { useApp } from '@/hooks/state/use-app';
import { useAccount } from '@/hooks/state/use-account';
import { useOptionalSpace } from '@/features/spaces';
import { ScheduleItem } from '@/types/domain';

export function useSpaceSchedule() {
  const { state: appState } = useApp();
  const { state: accountState } = useAccount();
  const { activeAccount, organizations } = appState;
  const { schedule_items: allItems } = accountState;
  const spaceContext = useOptionalSpace();

  const activeOrg = useMemo(() =>
    activeAccount?.type === 'organization' ? organizations[activeAccount.id] : null,
    [organizations, activeAccount]
  );
  
  const orgMembers = useMemo(() => activeOrg?.members || [], [activeOrg]);
  
  const localItems: ScheduleItem[] = useMemo(() => {
    if (!spaceContext) return [];
    return Object.values(allItems || {}).filter(item => item.spaceId === spaceContext.state.space.id);
  }, [allItems, spaceContext]);

  return { localItems, orgMembers };
}
