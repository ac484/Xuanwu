// [職責] 為特定空間的所有頁面提供共享的 Context、UI 骨架，並動態渲染對應能力。
"use client";

import { ReactNode } from "react";
import { SpaceLayout } from "@/features/spaces";

/**
 * SpaceLayout - The main layout component.
 * Its sole responsibility is to provide the SpaceContextShell and a Suspense boundary for page transitions.
 */
export default function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { spaceId: string };
}) {
  return (
    <SpaceLayout spaceId={params.spaceId}>
        {children}
    </SpaceLayout>
  );
}
