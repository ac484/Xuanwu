"use client";

import { useState, useEffect, useMemo } from 'react';

import { Search, Command } from "lucide-react";

import { Button } from "@/app/_components/ui/button";
import { SidebarTrigger } from "@/app/_components/ui/sidebar";
import { useAuth } from '@/context/auth-context';
import { useAccount } from "@/hooks/state/use-account";
import { useApp } from "@/hooks/state/use-app";
import { Organization, SwitchableAccount, Workspace } from '@/types/domain';

import { LanguageSwitcher } from '../';
import { GlobalSearch } from "../_components/global-search";
import { NotificationCenter } from "../_components/notification-center";

/**
 * HeaderPage - The main "smart" component for the global header.
 *
 * Responsibility: This component is responsible for fetching all necessary
 * state, managing its own local state (like search modal visibility),
 * and passing data and callbacks down to its "dumb" child components.
 */
export function HeaderPage() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { state: appState, dispatch } = useApp();
  const { state: accountState } = useAccount();
  const { state: authState } = useAuth();
  
  const { user } = authState;
  const { organizations, notifications, activeAccount } = appState;
  const { workspaces } = accountState;
  
  const visibleWorkspaces = useMemo(() => {
    if (!activeAccount || !user || !workspaces) return [];

    const accountWorkspaces = Object.values(workspaces).filter((workspace: Workspace) => {
      return workspace.dimensionId === activeAccount.id;
    });

    if (activeAccount.type === 'user') {
      return accountWorkspaces;
    }
    
    if (activeAccount.type === 'organization') {
      const activeOrg = organizations[activeAccount.id];
      if (!activeOrg) return [];
      
      if (activeOrg.ownerId === user.id) {
        return accountWorkspaces;
      }
      
      const userTeamIds = new Set(
        (activeOrg.teams || [])
          .filter(team => (team.memberIds || []).includes(user.id))
          .map(team => team.id)
      );

      return accountWorkspaces.filter(workspace => {
        const hasDirectGrant = (workspace.grants || []).some(g => g.userId === user.id && g.status === 'active');
        const hasTeamGrant = (workspace.teamIds || []).some(teamId => userTeamIds.has(teamId));
        const hasExplicitAccess = hasDirectGrant || hasTeamGrant;
        
        if (workspace.visibility === 'visible') {
          return true;
        }

        if (workspace.visibility === 'hidden') {
          return hasExplicitAccess;
        }

        return false;
      });
    }

    return [];
  }, [workspaces, activeAccount, organizations, user]);

  const organizationsArray = Object.values(organizations);
  const activeOrg = activeAccount?.type === 'organization' ? organizations[activeAccount.id] : null;
  const activeOrgMembers = activeOrg?.members ?? [];

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsSearchOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const handleSwitchOrg = (org: Organization) => {
      dispatch({ type: 'SET_ACTIVE_ACCOUNT', payload: {id: org.id, type: 'organization', name: org.name} as SwitchableAccount });
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/60 backdrop-blur-md px-6">
      <SidebarTrigger />
      <div className="flex-1 flex items-center justify-center">
        <Button
          variant="outline"
          className="relative w-full max-w-md justify-start text-sm text-muted-foreground bg-muted/40 border-none h-9 group"
          onClick={() => setIsSearchOpen(true)}
        >
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
          <span className="pl-7">Search dimensions, spaces, or people...</span>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
            <div className="hidden md:flex items-center gap-1 text-[10px] text-muted-foreground border rounded px-1.5 py-0.5 bg-background shadow-sm ml-1">
              <Command className="w-2.5 h-2.5" /> K
            </div>
          </div>
        </Button>
      </div>
      <div className="flex items-center gap-3">
        <NotificationCenter notifications={notifications} dispatch={dispatch} />
        <LanguageSwitcher />
      </div>
      <GlobalSearch
        isOpen={isSearchOpen}
        onOpenChange={setIsSearchOpen}
        organizations={organizationsArray}
        workspaces={visibleWorkspaces}
        members={activeOrgMembers}
        activeOrgId={activeOrg?.id || null}
        onSwitchOrg={handleSwitchOrg}
      />
    </header>
  );
}
