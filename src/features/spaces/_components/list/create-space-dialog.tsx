// [職責] 建立空間的彈窗 UI
"use client";

import { useState } from "react";

import { Button } from "@/app/_components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/app/_components/ui/dialog";
import { Input } from "@/app/_components/ui/input";
import { Label } from "@/app/_components/ui/label";
import { useI18n } from "@/features/core/i18n/i18n-context";
import { useApp } from "@/hooks/state/use-app";

import { handleCreateSpace } from "../../_actions/space-actions";


interface CreateSpaceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateSpaceDialog({ open, onOpenChange }: CreateSpaceDialogProps) {
  const {
    state: { activeAccount },
  } = useApp();
  const { t } = useI18n();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const onCreate = async () => {
    setLoading(true);
    await handleCreateSpace(name, activeAccount, () => {
      setName("");
      onOpenChange(false);
    }, t);
    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-2xl">
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl">
            {t("spaces.createLogicalSpace")}
          </DialogTitle>
          <DialogDescription>
            {t("spaces.createDescription").replace(
              "{name}",
              activeAccount?.name || ""
            )}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="space-name">{t("spaces.spaceName")}</Label>
            <Input
              id="space-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t("spaces.spaceNamePlaceholder")}
              className="rounded-xl h-11"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            {t("common.cancel")}
          </Button>
          <Button onClick={onCreate} className="rounded-xl shadow-lg shadow-primary/20" disabled={loading}>
            {loading ? t('common.creating') : t("common.confirmCreation")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
