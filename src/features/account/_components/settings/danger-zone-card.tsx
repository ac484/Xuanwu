"use client";

import { useTranslations } from "next-intl";

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
  const t = useTranslations("SettingsPage");

  return (
    <Card className="border-destructive">
      <CardHeader>
        <CardTitle>{t("dangerZone.title")}</CardTitle>
        <CardDescription>{t("dangerZone.description")}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-start p-4 border border-destructive rounded-lg">
          <div>
            <h3 className="font-semibold">
              {t("dangerZone.deleteOrganization.label")}
            </h3>
            <p className="text-sm text-muted-foreground">
              {t("dangerZone.deleteOrganization.description")}
            </p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="destructive">
                {t("dangerZone.deleteOrganization.button")}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {t("dangerZone.deleteOrganization.dialog.title")}
                </DialogTitle>
                <DialogDescription>
                  {t("dangerZone.deleteOrganization.dialog.description")}
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button variant="destructive" onClick={onDelete}>
                  {t("dangerZone.deleteOrganization.dialog.confirm")}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
}
