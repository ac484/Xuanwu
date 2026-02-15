"use client";

import { useCallback } from 'react';

import { MemberReference, ScheduleItem } from "@/types/domain";

import { AssignMemberDropdown } from "../_components/assign-member-dropdown";
import { UnifiedScheduleView } from "../_components/unified-schedule-view";
import { useSpaceSchedule } from "../_hooks/use-space-schedule";
import { useSpaceScheduleActions } from "../_hooks/use-space-schedule-actions";



/**
 * Space Schedule Page (The "Proposer" Mapper)
 * 
 * ARCHITECTURAL ROLE:
 * This is a "thin" mapper component. Its SOLE RESPONSIBILITY is to render the 
 * cohesive, self-contained `UnifiedScheduleView` component, instructing it to 
 * run in "space" mode. It only fetches data relevant to its context.
 */
export function SpaceSchedulePage() {
  const { localItems, orgMembers } = useSpaceSchedule();
  const { assignMember, unassignMember } = useSpaceScheduleActions();

  const renderItemActions = useCallback((item: ScheduleItem) => (
    <AssignMemberDropdown 
      item={item} 
      members={orgMembers as MemberReference[]} 
      assignMember={assignMember}
      unassignMember={unassignMember}
    />
  ), [orgMembers, assignMember, unassignMember]);


  return (
    <UnifiedScheduleView
      viewMode="space"
      items={localItems}
      members={orgMembers}
      renderItemActions={renderItemActions}
    />
  );
}
