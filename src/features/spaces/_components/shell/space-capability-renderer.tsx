// [職責] 詳情頁入口：動態渲染由 URL 參數指定的「能力(Capability)」。
'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { CAPABILITIES } from "@/features/spaces/registry/registry";

function CapabilityRenderer() {
  const searchParams = useSearchParams();
  const capability = searchParams.get('capability') || 'overview';

  // A capability must exist and have a 'single' view to be rendered in this context.
  const CapabilityComponent = CAPABILITIES[capability]?.views.single.component;

  if (CapabilityComponent) {
    return <CapabilityComponent />;
  }

  // Fallback for unknown capability
  return (
    <div className="p-8 text-center text-muted-foreground border-2 border-dashed rounded-xl">
      Unknown capability: <strong>{capability}</strong>
    </div>
  );
}

/**
 * SpaceCapabilityRenderer - The entry point for rendering a specific capability.
 * Its SOLE RESPONSIBILITY is to dynamically render the correct capability component
 * based on the URL search parameter, wrapped in a Suspense boundary.
 */
export function SpaceCapabilityRenderer() {
  return (
    // This Suspense is for Next.js to handle the boundary between the layout and the page
    // while search params are being read on the client.
    <Suspense>
      <CapabilityRenderer />
    </Suspense>
  );
}
