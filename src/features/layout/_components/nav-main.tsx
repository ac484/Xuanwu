
"use client";

import {
  LayoutDashboard,
  Layers,
  FolderTree,
  ChevronRight,
  Settings,
} from "lucide-react";
import Link from "next/link";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/app/_components/ui/collapsible";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarMenuButton,
} from "@/app/_components/ui/sidebar";
import { GOVERNANCE_NAV_ITEMS, AGGREGATED_CAPABILITY_NAV_ITEMS } from "@/features/account/_constants/organization-navigation";

interface NavMainProps {
  pathname: string;
  isOrganizationAccount: boolean;
  t: (key: string) => string;
}

export function NavMain({ pathname, isOrganizationAccount, t }: NavMainProps) {
  
  const isPartiallyActive = (path: string) => pathname === path || pathname.startsWith(`${path}/`);

  // Combine both arrays to generate the full list for the sidebar section.
  const allGovernanceItems = [...GOVERNANCE_NAV_ITEMS, ...AGGREGATED_CAPABILITY_NAV_ITEMS];

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton asChild isActive={pathname === "/overview"}>
          <Link href="/overview">
            <LayoutDashboard />
            <span className="font-semibold">{t("navigation.dashboard")}</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>

      <SidebarMenuItem>
        <SidebarMenuButton asChild isActive={isPartiallyActive("/spaces")}>
          <Link href="/spaces">
            <Layers />
            <span className="font-semibold">{t("navigation.spaces")}</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>

      {isOrganizationAccount && (
        <SidebarMenuItem>
          <Collapsible defaultOpen className="group/collapsible w-full">
            <SidebarMenuButton asChild>
                <CollapsibleTrigger>
                  <FolderTree />
                  <span className="font-semibold">{t("sidebar.accountGovernance")}</span>
                  <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
                </CollapsibleTrigger>
            </SidebarMenuButton>
            <CollapsibleContent>
              <SidebarMenuSub>
                {allGovernanceItems.map((item) => (
                  <SidebarMenuSubItem key={item.path}>
                    <SidebarMenuSubButton asChild isActive={isPartiallyActive(item.path)}>
                      <Link href={item.path} className="flex items-center gap-2">
                        <item.icon className="w-3 h-3" /> {t(item.translationKey)}
                      </Link>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                ))}
              </SidebarMenuSub>
            </CollapsibleContent>
          </Collapsible>
        </SidebarMenuItem>
      )}
       <SidebarMenuItem>
        <SidebarMenuButton asChild isActive={isPartiallyActive("/settings")}>
          <Link href="/settings">
            <Settings />
            <span className="font-semibold">{t("navigation.settings")}</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
