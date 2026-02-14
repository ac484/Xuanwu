/**
 * @fileoverview use-task-upload.ts - A hook for handling task attachment uploads.
 * @description This hook abstracts the logic for uploading files related to a task.
 */
"use client";

import { useCallback } from "react";
import { uploadTaskAttachment as uploadTaskAttachmentFacade } from '@/features/core/firebase/storage/storage.facade';
import { useWorkspace } from '@/features/workspaces/_context/workspace-context';

export function useTaskUpload() {
  const { workspace } = useWorkspace();

  /**
   * Uploads an image attachment for a workspace task.
   * @param file The file to upload.
   * @returns A promise resolving to the public download URL of the file.
   */
  const uploadTaskAttachment = useCallback(async (file: File): Promise<string> => {
    return uploadTaskAttachmentFacade(workspace.id, file);
  }, [workspace.id]);

  return { uploadTaskAttachment };
}
