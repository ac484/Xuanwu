// [職責] 列表佈局容器
"use client";

import { Eye, EyeOff, Shield, MoreVertical } from "lucide-react";
import { useRouter } from "next/navigation";

import { Badge } from "@/app/_components/ui/badge";
import { Button } from "@/app/_components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/app/_components/ui/dropdown-menu";
import { useI18n } from "@/features/core/i18n/i18n-context";
import type { Space } from "@/types/domain";

interface SpaceListItemProps {
  space: Space;
  onOpenDelete: (space: Space) => void;
}

function SpaceListItem({ space, onOpenDelete }: SpaceListItemProps) {
  const router = useRouter();
  const { t } = useI18n();

  return (
    <div
      className="flex items-center justify-between p-4 bg-card border border-border/60 rounded-xl hover:bg-muted/30 transition-colors group cursor-pointer"
      onClick={() => router.push(`/spaces/${space.id}`)}
    >
      <div className="flex items-center gap-4">
        <div className="p-2 bg-primary/5 rounded-lg text-primary">
          <Shield className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-semibold text-sm">{space.name}</h3>
          <div className="flex items-center gap-2 mt-0.5">
            <Badge
              variant="outline"
              className="text-[9px] uppercase tracking-tighter px-1.5 h-4 flex items-center gap-1"
            >
              {space.visibility === "visible" ? (
                <Eye className="w-3 h-3" />
              ) : (
                <EyeOff className="w-3 h-3" />
              )}
              {space.visibility === "visible"
                ? t("common.visible")
                : t("common.hidden")}
            </Badge>
            <span className="text-[10px] text-muted-foreground">
              ID: {space.id.toUpperCase()}
            </span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-right hidden md:block">
          <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest leading-none mb-1">
            {t("spaces.accessProtocol")}
          </p>
          <p className="text-[11px] font-medium">
            {space.protocol || t("spaces.defaultProtocol")}
          </p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:bg-accent/10"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreVertical className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onSelect={() => router.push(`/spaces/${space.id}?capability=settings`)}>
              Settings
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={(e) => { e.preventDefault(); onOpenDelete(space); }} className="text-destructive">
              Destroy
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

interface SpaceTableViewProps {
  spaces: Space[];
  onOpenDelete: (space: Space) => void;
}

export function SpaceTableView({ spaces, onOpenDelete }: SpaceTableViewProps) {
  return (
    <div className="flex flex-col gap-3">
      {spaces.map((s) => (
        <SpaceListItem 
          key={s.id} 
          space={s}
          onOpenDelete={onOpenDelete}
        />
      ))}
    </div>
  );
}
