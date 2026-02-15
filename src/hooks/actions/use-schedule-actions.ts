
"use client";
import { useCallback } from "react";

import {
  updateScheduleItemStatus,
  assignMemberToScheduleItem,
  unassignMemberFromScheduleItem,
} from "@/features/account/services/account.service";
import { toast } from "@/hooks/ui/use-toast";
import { ScheduleItem } from "@/types/domain";

/**
 * ARCHITECTURAL NOTE: This is the single, global action hook for all schedule-related mutations.
 * It operates on the `accountId` derived directly from the `ScheduleItem` passed into its functions,
 * making it context-agnostic and usable from any view.
 */
export function useScheduleActions() {
  const performAction = useCallback(async (action: () => Promise<void>, successMessage: string) => {
    try {
      await action();
      toast({ title: successMessage });
    } catch (error) {
      toast({ variant: "destructive", title: "Action failed", description: error instanceof Error ? error.message : "Unknown error" });
      throw error; // Re-throw so UI can react if needed
    }
  }, []);

  const approveProposal = useCallback((item: ScheduleItem) => {
    return performAction(
      () => updateScheduleItemStatus(item.accountId, item.id, 'OFFICIAL'),
      "Proposal Approved"
    );
  }, [performAction]);

  const rejectProposal = useCallback((item: ScheduleItem) => {
    return performAction(
      () => updateScheduleItemStatus(item.accountId, item.id, 'REJECTED'),
      "Proposal Rejected"
    );
  }, [performAction]);

  const assignMember = useCallback(async (item: ScheduleItem, memberId: string) => {
    await performAction(
      () => assignMemberToScheduleItem(item.accountId, item.id, memberId),
      "Member Assigned"
    );
  }, [performAction]);

  const unassignMember = useCallback(async (item: ScheduleItem, memberId: string) => {
    await performAction(
      () => unassignMemberFromScheduleItem(item.accountId, item.id, memberId),
      "Member Unassigned"
    );
  }, [performAction]);

  return { approveProposal, rejectProposal, assignMember, unassignMember };
}
