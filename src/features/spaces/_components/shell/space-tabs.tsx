// [職責] 能力 (Capabilities) 導覽：只負責渲染頁籤，不關心內容
"use client";

import { useMemo } from "react";
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { Tabs, TabsList, TabsTrigger } from "@/app/_components/ui/tabs";
import { useSpace } from "@/features/spaces";
import { CAPABILITIES } from "@/features/spaces/registry/registry";
import { cn } from "@/lib/utils";

const CORE_CAPABILITIES = [
  { id: "overview", name: "Overview" },
  { id: "capabilities", name: "Capabilities" },
  { id: "settings", name: "Settings" }
];

export function SpaceTabs() {
  const { state } = useSpace();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentCapability = searchParams?.get('capability') || 'overview';

  const mountedCapabilities = useMemo(() => {
    const dynamicCapabilities = (state.space?.capabilities || []).map(
      (capability: any) => ({
        id: capability.id,
        name: capability.name,
      })
    );
    
    const allCaps = [
      ...CORE_CAPABILITIES,
      ...dynamicCapabilities
    ];
    
    const uniqueCapsMap = new Map();
    allCaps.forEach(item => {
        if (CAPABILITIES[item.id]) {
          uniqueCapsMap.set(item.id, item);
        }
    });

    const finalCaps: any[] = [];
    if (uniqueCapsMap.has('overview')) finalCaps.push(uniqueCapsMap.get('overview'));
    if (uniqueCapsMap.has('capabilities')) finalCaps.push(uniqueCapsMap.get('capabilities'));
    
    dynamicCapabilities.forEach((cap: any) => {
      if(uniqueCapsMap.has(cap.id) && !['overview', 'capabilities', 'settings'].includes(cap.id)) {
        finalCaps.push(cap);
      }
    })

    if (uniqueCapsMap.has('settings')) finalCaps.push(uniqueCapsMap.get('settings'));


    return finalCaps;
  }, [state.space?.capabilities]);

  return (
    <Tabs value={currentCapability} className="w-full">
      <TabsList className="bg-muted/40 p-1 border-border/50 rounded-xl w-full flex overflow-x-auto justify-start no-scrollbar">
        {mountedCapabilities.map((cap: any) => {
          const detail = CAPABILITIES[cap.id];
          return detail ? (
            <Link key={cap.id} href={{ pathname: pathname || '', query: { capability: cap.id } }} legacyBehavior passHref>
              <TabsTrigger
                value={cap.id}
                className={cn(
                  "text-[9px] font-bold uppercase tracking-widest px-4 rounded-lg data-[state=active]:shadow-sm",
                  "data-[state=active]:bg-background data-[state=active]:text-foreground"
                )}
              >
                {detail.label}
              </TabsTrigger>
            </Link>
          ) : null;
        })}
      </TabsList>
    </Tabs>
  );
}
