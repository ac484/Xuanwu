// [職責] 顯示 Mounted/Isolated 狀態
"use client";

import { Eye, EyeOff } from "lucide-react";

import { Badge } from "@/app/_components/ui/badge";
import { useSpace } from "@/features/spaces";

export function SpaceStatusBar() {
  const { state } = useSpace();

  if (!state.space) {
      return null; // Or a loading state
  }

  const isVisible = state.space.visibility === "visible";

  return (
    <div className="flex items-center gap-2">
      <Badge
        className="bg-primary/10 text-primary border-primary/20 uppercase text-[9px] tracking-[0.2em] font-bold px-2 py-0.5"
      >
        ID: {state.space.id.toUpperCase()}
      </Badge>
      <Badge
        variant="outline"
        className="text-[9px] uppercase font-bold flex items-center gap-1 bg-background/50 backdrop-blur-sm"
      >
        {isVisible ? (
          <Eye className="w-3.5 h-3.5" />
        ) : (
          <EyeOff className="w-3.5 h-3.5" />
        )}
        {isVisible ? "Mounted" : "Isolated"}
      </Badge>
    </div>
  );
}
