// [職責] 為特定空間的所有頁面提供共享的 Context、UI 骨架，並動態渲染對應能力。
"use client";

import { ReactNode, Suspense } from "react";

import { Loader2 } from "lucide-react";

import { SpaceHeader } from "@/features/spaces/_components/shell/space-header";
import { SpaceContext, useSpaceController } from "@/features/spaces/_context";

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
 * SpaceLayout - The main layout component.
 * Its sole responsibility is to provide the SpaceContext and a Suspense boundary for page transitions.
 */
export function SpaceLayout({
  children,
  spaceId,
}: {
  children: React.ReactNode;
  spaceId: string;
}) {
  const { state, dispatch } = useSpaceController(spaceId);

  return (
    <SpaceContext.Provider value={{ state, dispatch }}>
      <div className="space-y-6 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-2 duration-500 pb-20 gpu-accelerated">
        <SpaceHeader />
        <Suspense fallback={<PageLoading />}>
          {children}
        </Suspense>
      </div>
    </SpaceContext.Provider>
  );
}
