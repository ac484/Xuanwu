"use client";

import { useState, useCallback } from "react";
import { uploadDailyPhoto as uploadDailyPhotoFacade } from '@/infra/firebase/storage/storage.facade';
import { useWorkspace } from "@/features/workspaces/_context/workspace-context";
import { useApp } from "@/hooks/state/use-app";

export function useDailyUpload() {
  const { workspace } = useWorkspace();
  const { state: appState } = useApp();
  const { activeAccount } = appState;
  const [isUploading, setIsUploading] = useState(false);

  const upload = useCallback(async (files: File[]): Promise<string[]> => {
    if (files.length === 0) return [];
    if (!activeAccount || activeAccount.type !== 'organization') {
      throw new Error("Photo uploads are only supported in an organization context.");
    }
    setIsUploading(true);
    try {
      const urls = await Promise.all(
        files.map(file => uploadDailyPhotoFacade(activeAccount.id, workspace.id, file))
      );
      return urls;
    } catch (error) {
      console.error("Daily upload failed:", error);
      throw error;
    } finally {
      setIsUploading(false);
    }
  }, [activeAccount, workspace.id]);

  return { isUploading, upload };
}
