// [職責] 封裝所有的 Mutation (Create, Delete 呼叫)
"use client";

import {
  createSpace as createSpaceFacade,
  deleteSpace as deleteSpaceFacade,
} from "@/features/core/firebase/firestore/firestore.facade";
import { toast } from "@/hooks/ui/use-toast";
import type { SwitchableAccount } from "@/types/domain";

const getErrorMessage = (error: unknown, fallback: string) =>
  error instanceof Error ? error.message : fallback;

export const handleCreateSpace = async (
  name: string,
  activeAccount: SwitchableAccount | null,
  onSuccess: () => void,
  t: (key: string) => string
) => {
  if (!name.trim() || !activeAccount) {
    toast({
      variant: "destructive",
      title: t("spaces.creationFailed"),
      description: t("spaces.accountNotFound"),
    });
    return;
  }

  try {
    await createSpaceFacade(name, activeAccount);
    toast({
      title: t("spaces.logicalSpaceCreated"),
      description: t("spaces.spaceSynchronized").replace("{name}", name),
    });
    onSuccess();
  } catch (error: unknown) {
    console.error("Error creating space:", error);
    toast({
      variant: "destructive",
      title: t("spaces.failedToCreateSpace"),
      description: getErrorMessage(error, t("common.unknownError")),
    });
  }
};

export const handleDeleteSpace = async (
  spaceId: string,
  spaceName: string,
  onSuccess: () => void
) => {
  try {
    await deleteSpaceFacade(spaceId);
    toast({ title: "Space node destroyed" });
    onSuccess();
  } catch (error: unknown) {
    toast({ variant: "destructive", title: "Failed to destroy space", description: getErrorMessage(error, "Unknown error") });
  }
};
