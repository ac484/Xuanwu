// [職責] 顯示 Mounted/Isolated 狀態
"use client";

import { Badge } from "@/app/_components/ui/badge";
import { Eye, EyeOff } from "lucide-react";
import { useContext } from "react";
import { WorkspaceContext } from "@/features/workspaces/_context/workspace-context";

function useWorkspace() {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error("useWorkspace must be used within a WorkspaceProvider");
  }
  return context.state;
}

export function WorkspaceStatusBar() {
  const { workspace } = useWorkspace();
  const isVisible = workspace.visibility === "visible";

  return (
    <div className="flex items-center gap-2">
      <Badge
        className="bg-primary/10 text-primary border-primary/20 uppercase text-[9px] tracking-[0.2em] font-bold px-2 py-0.5"
      >
        ID: {workspace.id.toUpperCase()}
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
