"use client";

import { useCallback } from 'react';

import { useScheduleActions } from "@/hooks/actions/use-schedule-actions";
import { MemberReference, ScheduleItem } from "@/types/domain";

import { AssignMemberDropdown } from "../_components/assign-member-dropdown";
import { UnifiedScheduleView } from "../_components/unified-schedule-view";
import { useScheduleData } from "../_hooks/use-schedule-data";




/**
 * Organization Schedule Page (The "Governor" Mapper)
 * 
 * ARCHITECTURAL ROLE:
 * This is a "thin" mapper component. Its SOLE RESPONSIBILITY is to render the 
 * cohesive, self-contained `UnifiedScheduleView` component, instructing it to 
 * run in "organization" mode. It fetches global data from a centralized hook
 * and provides global actions.
 */
export function OrganizationSchedulePage() {
  const { allItems, orgMembers, pendingProposals, decisionHistory, upcomingEvents, presentEvents } = useScheduleData('organization');
  const { approveProposal, rejectProposal, assignMember, unassignMember } = useScheduleActions();
  
  // Define the action UI to be injected into the calendar grid for this view
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
      viewMode="organization"
      items={allItems}
      members={orgMembers}
      pendingProposals={pendingProposals}
      decisionHistory={decisionHistory}
      upcomingEvents={upcomingEvents}
      presentEvents={presentEvents}
      onApproveProposal={approveProposal}
      onRejectProposal={rejectProposal}
      renderItemActions={renderItemActions} // Inject the assignment UI
    />
  );
}
