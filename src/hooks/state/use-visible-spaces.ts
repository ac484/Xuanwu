"use client";

import { useMemo } from 'react';

import { useAuth } from '@/context/auth-context';
import { Space } from '@/types/space';

import { useAccount } from './use-account';
import { useApp } from './use-app';

/**
 * A hook that centralizes the logic for determining which spaces are visible to the current user
 * based on the active account context.
 *
 * @returns A memoized array of `Space` objects that the current user is allowed to see in the active dimension.
 */
export function useVisibleSpaces() {
  const { state: appState } = useApp();
  const { state: accountState } = useAccount();
  const { state: authState } = useAuth();
  
  const { user } = authState;
  const { organizations, activeAccount } = appState;
  const { spaces } = accountState;

  const visibleSpaces = useMemo(() => {
    if (!activeAccount || !user || !spaces) return [];

    // Filter spaces that belong to the active dimension.
    const accountSpaces = Object.values(spaces).filter((space: Space) => {
      return space.dimensionId === activeAccount.id;
    });

    // If the active account is a user's personal account, they see all their own spaces.
    if (activeAccount.type === 'user') {
      return accountSpaces;
    }
    
    // If the active account is an organization, apply visibility logic.
    if (activeAccount.type === 'organization') {
      const activeOrg = organizations[activeAccount.id];
      if (!activeOrg) return [];
      
      // Org owners can see everything in their org
      if (activeOrg.ownerId === user.id) {
        return accountSpaces;
      }
      
      const userTeamIds = new Set(
        (activeOrg.teams || [])
          .filter(team => (team.memberIds || []).includes(user.id))
          .map(team => team.id)
      );

      return accountSpaces.filter(space => {
        // Check for explicit access (direct grant or team grant)
        const hasDirectGrant = (space.grants || []).some(g => g.userId === user.id && g.status === 'active');
        const hasTeamGrant = (space.teamIds || []).some(teamId => userTeamIds.has(teamId));
        const hasExplicitAccess = hasDirectGrant || hasTeamGrant;
        
        // If space is 'visible', all org members can see it.
        if (space.visibility === 'visible') {
          return true;
        }

        // If space is 'hidden', only users with explicit access can see it.
        if (space.visibility === 'hidden') {
          return hasExplicitAccess;
        }

        return false;
      });
    }

    return [];
  }, [spaces, activeAccount, organizations, user]);

  return visibleSpaces;
}
