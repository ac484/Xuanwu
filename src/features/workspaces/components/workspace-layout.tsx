// [職責] 為特定工作區的所有頁面提供共享的 Context、UI 骨架，並動態渲染對應能力。
"use client";

import { ReactNode, Suspense } from "react";
import { WorkspaceContext } from "@/features/workspaces/_context/workspace-context";
import { WorkspaceHeader } from "@/features/workspaces/_components/shell/workspace-header";
import { Loader2 } from "lucide-react";

/**
 * A suspense boundary to show a loading state while the page component (a capability) loads.
 */
function PageLoading() {
    return (
        <div className="flex items-center justify-center p-20">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
    );
}

/**
 * WorkspaceLayout - The main layout component.
 * Its sole responsibility is to provide the WorkspaceContext and a Suspense boundary for page transitions.
 */
export function WorkspaceLayout({
  children,
  workspaceId,
}: {
  children: React.ReactNode;
  workspaceId: string;
}) {
  
  return (
    <WorkspaceContext.Provider value={null}>
      <div className="space-y-6 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-2 duration-500 pb-20 gpu-accelerated">
        <WorkspaceHeader />
        <Suspense fallback={<PageLoading />}>
          {children}
        </Suspense>
      </div>
    </WorkspaceContext.Provider>
  );
}
