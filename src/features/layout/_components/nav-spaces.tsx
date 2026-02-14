"use client";

import Link from "next/link";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from "@/app/_components/ui/sidebar";
import { Badge } from "@/app/_components/ui/badge";
import { Terminal } from "lucide-react";
import { Space } from "@/types/space";
import { cn } from "@/lib/utils";

interface NavSpacesProps {
  spaces: Space[];
  pathname: string;
  t: (key: string) => string;
}

export function NavSpaces({ spaces, pathname, t }: NavSpacesProps) {
  if (spaces.length === 0) {
    return null;
  }

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="px-3 mb-2 text-[10px] font-bold uppercase tracking-[0.2em] opacity-50">
        {t('sidebar.quickAccess')}
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {spaces.map((space) => (
            <SidebarMenuItem key={space.id}>
              <Link
                href={`/spaces/${space.id}`}
                className={cn(
                  "peer/menu-button flex w-full items-center justify-between gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-none ring-sidebar-ring transition-all hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2",
                  pathname.startsWith(`/spaces/${space.id}`) && "bg-primary/10 text-primary font-semibold"
                )}
              >
                <div className="flex items-center gap-2 truncate">
                  <Terminal className="w-3 h-3 text-primary/60" />
                  <span className="truncate text-xs font-medium">{space.name}</span>
                </div>
                <Badge variant="outline" className="text-[8px] h-3.5 px-1 uppercase">
                  {space.id.slice(-3).toUpperCase()}
                </Badge>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
