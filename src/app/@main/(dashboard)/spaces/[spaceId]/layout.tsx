// [職責] 為特定空間的所有頁面提供共享的 Context、UI 骨架，並動態渲染對應能力。
"use client";

import { ReactNode } from "react";

import { SpaceContextShell, SpaceLayout } from "@/features/spaces";

/**
 * This is the root layout for a specific space.
 * Its primary responsibility is to wrap the content with the SpaceContextShell,
 * which provides the necessary context for all child components within this space.
 * It then uses SpaceLayout for the consistent visual structure.
 */
export default function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { spaceId: string };
}) {
  return (
    <SpaceContextShell spaceId={params.spaceId}>
      <SpaceLayout>
        {children}
      </SpaceLayout>
    </SpaceContextShell>
  );
}
