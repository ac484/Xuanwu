"use client";

import { useCallback } from "react";

import {
  assignMemberToScheduleItem,
  unassignMemberFromScheduleItem,
} from "@/features/core/firebase/firestore/firestore.facade";
import { useSpace } from "@/features/spaces";
import { toast } from "@/hooks/ui/use-toast";
import { ScheduleItem } from "@/types/domain";

/**
 * ARCHITECTURAL NOTE: This is a space-level action hook.
 * It operates on the `space.id` and `space.dimensionId` derived from the `useSpace` context.
 */
export function useSpaceScheduleActions() {
  const { state } = useSpace();
  const { space } = state;
  const orgId = space.dimensionId;

  const performAction = useCallback(async (action: () => Promise<void>, successMessage: string) => {
    try {
      await action();
      toast({ title: successMessage });
    } catch (error) {
      toast({ variant: "destructive", title: "Action failed", description: error instanceof Error ? error.message : "Unknown error" });
      throw error; // Re-throw so UI can react if needed
    }
  }, []);

  const assignMember = useCallback(async (item: ScheduleItem, memberId: string) => {
    await performAction(
      () => assignMemberToScheduleItem(orgId, item.id, memberId),
      "Member Assigned"
    );
  }, [performAction, orgId]);

  const unassignMember = useCallback(async (item: ScheduleItem, memberId: string) => {
    await performAction(
      () => unassignMemberFromScheduleItem(orgId, item.id, memberId),
      "Member Unassigned"
    );
  }, [performAction, orgId]);

  return { assignMember, unassignMember };
}
