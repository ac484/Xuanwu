"use client";

import { useOptionalWorkspace } from "@/features/workspaces";
import { DailyLog } from "@/types/domain";
import { Button } from "@/app/_components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/app/_components/ui/dropdown-menu";
import { Share2 } from "lucide-react";
import { toast } from "@/hooks/ui/use-toast";

interface ShareButtonProps {
  log: DailyLog;
}

export function ShareButton({ log }: ShareButtonProps) {
  const workspaceContext = useOptionalWorkspace();

  const handleForward = (target: "tasks") => {
    if (!workspaceContext) {
        toast({
            variant: "destructive",
            title: "Action Not Available",
            description: "Forwarding logs is only possible within a workspace context.",
        });
        return;
    }

    workspaceContext.eventBus.publish("daily:log:forwardRequested", {
      log: log,
      targetCapability: target,
      action: "create",
    });

    toast({
      title: "Forward Action Triggered",
      description: `Request sent to the '${target}' capability.`,
    });
  };

  if (!workspaceContext) {
    return null; 
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9">
          <Share2 className="w-5 h-5 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onSelect={() => handleForward("tasks")}>
          Create Task from this Log
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
