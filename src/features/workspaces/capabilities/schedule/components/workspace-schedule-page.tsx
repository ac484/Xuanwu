"use client";

import { UnifiedScheduleView } from "../_components/unified-schedule-view";
import { useWorkspaceSchedule } from "../_hooks/use-workspace-schedule";
import { useWorkspaceScheduleActions } from "../_hooks/use-workspace-schedule-actions";
import { MemberReference, ScheduleItem } from "@/types/domain";
import { AssignMemberDropdown } from "../_components/assign-member-dropdown";
import { useCallback } from 'react';


/**
 * Workspace Schedule Page (The "Proposer" Mapper)
 * 
 * ARCHITECTURAL ROLE:
 * This is a "thin" mapper component. Its SOLE RESPONSIBILITY is to render the 
 * cohesive, self-contained `UnifiedScheduleView` component, instructing it to 
 * run in "workspace" mode. It only fetches data relevant to its context.
 */
export function WorkspaceSchedulePage() {
  const { localItems, orgMembers } = useWorkspaceSchedule();
  const { assignMember, unassignMember } = useWorkspaceScheduleActions();

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
      viewMode="workspace"
      items={localItems}
      members={orgMembers}
      renderItemActions={renderItemActions}
    />
  );
}
