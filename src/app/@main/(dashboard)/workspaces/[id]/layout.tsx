// [職責] 為特定工作區的所有頁面提供共享的 Context、UI 骨架，並動態渲染對應能力。
"use client";

import { ReactNode } from "react";
import { WorkspaceLayout } from "@/features/workspaces";

/**
 * WorkspaceLayout - The main layout component.
 * Its sole responsibility is to provide the WorkspaceContextShell and a Suspense boundary for page transitions.
 */
export default function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { id: string };
}) {
  return (
    <WorkspaceLayout workspaceId={params.id}>
        {children}
    </WorkspaceLayout>
  );
}
