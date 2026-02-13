// [職責] 封裝所有的 Mutation (Create, Delete 呼叫)
"use client";

import { toast } from "@/hooks/ui/use-toast";
import {
  createWorkspace,
  deleteWorkspace as deleteWorkspaceFacade,
} from "@/infra/firebase/firestore/firestore.facade";
import type { SwitchableAccount } from "@/types/domain";

const getErrorMessage = (error: unknown, fallback: string) =>
  error instanceof Error ? error.message : fallback;

export const handleCreateWorkspace = async (
  name: string,
  activeAccount: SwitchableAccount | null,
  onSuccess: () => void,
  t: (key: string) => string
) => {
  if (!name.trim() || !activeAccount) {
    toast({
      variant: "destructive",
      title: t("workspaces.creationFailed"),
      description: t("workspaces.accountNotFound"),
    });
    return;
  }

  try {
    await createWorkspace(name, activeAccount);
    toast({
      title: t("workspaces.logicalSpaceCreated"),
      description: t("workspaces.spaceSynchronized").replace("{name}", name),
    });
    onSuccess();
  } catch (error: unknown) {
    console.error("Error creating workspace:", error);
    toast({
      variant: "destructive",
      title: t("workspaces.failedToCreateSpace"),
      description: getErrorMessage(error, t("common.unknownError")),
    });
  }
};

export const handleDeleteWorkspace = async (
  workspaceId: string,
  workspaceName: string,
  onSuccess: () => void
) => {
  try {
    await deleteWorkspaceFacade(workspaceId);
    toast({ title: "Workspace node destroyed" });
    onSuccess();
  } catch (error: unknown) {
    toast({ variant: "destructive", title: "Failed to destroy workspace", description: getErrorMessage(error, "Unknown error") });
  }
};
