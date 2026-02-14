"use client";

import { useCallback, useContext } from "react";
import {
  assignMemberToScheduleItem,
  unassignMemberFromScheduleItem,
} from "@/infra/firebase/firestore/firestore.facade";
import { ScheduleItem } from "@/types/domain";
import { toast } from "@/hooks/ui/use-toast";
import { WorkspaceContext } from "@/features/workspaces/_context/workspace-context";

function useWorkspace() {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error("useWorkspace must be used within a WorkspaceProvider");
  }
  return context.state;
}

/**
 * ARCHITECTURAL NOTE: This is a workspace-level action hook.
 * It operates on the `workspace.id` and `workspace.dimensionId` derived from the `useWorkspace` context.
 */
export function useWorkspaceScheduleActions() {
  const { workspace } = useWorkspace() as any;
  const orgId = workspace.dimensionId;

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
