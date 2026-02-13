
// @/hooks/actions/use-daily-actions.ts
/**
 * @fileoverview useDailyActions - A hook for managing actions on daily logs.
 * @description This hook centralizes business logic for interactive features
 * on daily log entries, such as liking.
 */
"use client";

import { useCallback } from "react";
import { useApp } from "@/hooks/state/use-app";
import { useAuth } from "@/context/auth-context";
import { toggleDailyLogLike } from "@/infra/firebase/firestore/repositories/account.repository";
import { toast } from "@/hooks/ui/use-toast";

export function useDailyActions() {
  const { state: appState } = useApp();
  const { state: authState } = useAuth();
  const { activeAccount } = appState;
  const { user } = authState;

  const toggleLike = useCallback(
    async (logId: string) => {
      if (!user || !activeAccount || activeAccount.type !== "organization") {
        toast({
          variant: "destructive",
          title: "Authentication Error",
          description: "You must be in an organization to interact.",
        });
        return;
      }

      try {
        await toggleDailyLogLike(activeAccount.id, logId, user.id);
      } catch (error) {
        console.error("Failed to toggle like:", error);
        toast({
          variant: "destructive",
          title: "Action Failed",
          description:
            error instanceof Error ? error.message : "Could not update like status.",
        });
        throw error;
      }
    },
    [user, activeAccount]
  );

  return { toggleLike };
}
