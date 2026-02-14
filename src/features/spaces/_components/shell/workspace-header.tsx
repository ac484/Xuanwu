// [職責] 組合顯示工作區的標題、狀態列與能力導覽頁籤
"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/app/_components/ui/button";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { WorkspaceStatusBar } from "./workspace-status-bar";
import { WorkspaceTabs } from "./workspace-tabs";
import { useWorkspace } from "@/features/workspaces";

function PageHeader({ title, description }: { title: string; description?: string; }) {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
      <div className="space-y-1">
        <h1 className="text-4xl font-bold tracking-tight font-headline">
          {title}
        </h1>
        {description && <p className="text-muted-foreground">{description}</p>}
      </div>
    </div>
  );
}

export function WorkspaceHeader() {
    const { state } = useWorkspace();
    const router = useRouter();

    if (!state.workspace) {
        return null; // Or a loading state
    }

    return (
        <>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-muted-foreground">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => router.back()}
                        className="h-8 w-8 hover:bg-primary/5"
                    >
                        <ArrowLeft className="w-4 h-4" />
                    </Button>
                    <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.2em]">
                        <span>Dimension Space</span>
                        <ChevronRight className="w-3 h-3 opacity-30" />
                        <span className="text-foreground">{state.workspace.name}</span>
                    </div>
                </div>
            </div>

            <PageHeader
                title={state.workspace.name}
                description="Manage this space's atomic capability stack, data exchange, and governance protocols."
            />
            
            <div className="mb-2">
                <WorkspaceStatusBar />
            </div>
            
            <div className="mt-6">
                <WorkspaceTabs />
            </div>
        </>
    );
}
