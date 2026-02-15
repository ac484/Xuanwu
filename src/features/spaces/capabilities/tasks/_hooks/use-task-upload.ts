/**
 * @fileoverview use-task-upload.ts - A hook for handling task attachment uploads.
 * @description This hook abstracts the logic for uploading files related to a task.
 */
"use client";

import { useCallback } from "react";

import { uploadTaskAttachment as uploadTaskAttachmentFacade } from '@/features/core/firebase/storage/storage.facade';
import { useSpace } from '@/features/spaces';

export function useTaskUpload() {
  const { state } = useSpace();
  const { space } = state;

  /**
   * Uploads an image attachment for a space task.
   * @param file The file to upload.
   * @returns A promise resolving to the public download URL of the file.
   */
  const uploadTaskAttachment = useCallback(async (file: File): Promise<string> => {
    return uploadTaskAttachmentFacade(space.id, file);
  }, [space.id]);

  return { uploadTaskAttachment };
}
