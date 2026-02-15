"use client";

import { useI18n } from "@/features/core/i18n/i18n-context";

import { Button } from "@/app/_components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/_components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/app/_components/ui/dialog";


interface DangerZoneCardProps {
  onDelete: () => void;
}

export function DangerZoneCard({ onDelete }: DangerZoneCardProps) {
  const { t } = useI18n();

  return (
    <Card className="border-destructive">
      <CardHeader>
        <CardTitle>{t("settings.dangerZone")}</CardTitle>
        <CardDescription>{t("settings.destroyDimensionDescription")}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-start p-4 border border-destructive rounded-lg">
          <div>
            <h3 className="font-semibold">
              {t("settings.destroyDimension")}
            </h3>
            <p className="text-sm text-muted-foreground">
              {t("settings.destroyDimensionDescription")}
            </p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="destructive">
                {t("settings.destroy")}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {t("settings.destroyDimension")}
                </DialogTitle>
                <DialogDescription>
                  {t("settings.confirmDestroy")}
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">{t("common.cancel")}</Button>
                </DialogClose>
                <Button variant="destructive" onClick={onDelete}>
                  {t("settings.destroy")}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
}
