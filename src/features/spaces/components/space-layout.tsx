// [職責] 為特定空間的所有頁面提供共享的 UI 骨架。
"use client";

import { ReactNode, Suspense } from "react";

import { Loader2 } from "lucide-react";

import { SpaceHeader } from "@/features/spaces/_components/shell/space-header";

function PageLoading() {
    return (
        <div className="flex items-center justify-center p-20">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
    );
}

export function SpaceLayout({ children }: { children: React.ReactNode }) {
  return (
      <div className="space-y-6 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-2 duration-500 pb-20 gpu-accelerated">
        <SpaceHeader />
        <Suspense fallback={<PageLoading />}>
          {children}
        </Suspense>
      </div>
  );
}
