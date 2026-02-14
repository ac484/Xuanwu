"use client";

import { useCallback } from "react";

import { serverTimestamp } from "firebase/firestore";

import { useFirebase } from "@/context/firebase-context";
import { addDocument } from "@/features/core/firebase/firestore/firestore.write.adapter";
import { useApp } from "@/hooks/state/use-app";
import type { AuditLog, User } from "@/types/domain";

/**
 * useLogger - Zero-cognition logging interface for the space shell.
 * Automatically handles the physical separation of Daily and Audit logs.
 * REFACTORED: Now a private hook within the space context.
 */
export function useLogger(spaceId?: string, spaceName?: string) {
  const { db } = useFirebase();
  const { state: appState } = useApp();
  const { activeAccount } = appState;

  const logDaily = useCallback(async (content: string, photoURLs: string[] | undefined, user: User) => {
    if (!activeAccount || activeAccount.type !== 'organization' || !user || !db) return;

    const dailyData = {
      content,
      author: {
        uid: user.id,
        name: user.name,
        avatarUrl: '', // You might want to get this from user profile
      },
      recordedAt: serverTimestamp(),
      createdAt: serverTimestamp(),
      accountId: activeAccount.id,
      spaceId: spaceId || "",
      spaceName: spaceName || "Dimension Level",
      photoURLs: photoURLs || [],
    };

    return addDocument(`organizations/${activeAccount.id}/dailyLogs`, dailyData);
  }, [db, activeAccount, spaceId, spaceName]);

  const logAudit = useCallback(async (action: string, target: string, type: AuditLog['type']) => {
    const user = { name: 'System' }; // Simplified for now
    if (!activeAccount || activeAccount.type !== 'organization' || !user || !db) return;

    const eventData: Omit<AuditLog, 'id'| 'recordedAt'> & { recordedAt: any } = {
      actor: user.name,
      action,
      target,
      type,
      recordedAt: serverTimestamp(),
      orgId: activeAccount.id,
      spaceId: spaceId || undefined
    };

    return addDocument(`organizations/${activeAccount.id}/auditLogs`, eventData);
  }, [db, activeAccount, spaceId]);

  return { logDaily, logAudit };
}
