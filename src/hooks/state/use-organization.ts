"use client";

import { useCallback } from 'react';

import { useAuth } from '@/context/auth-context';
import {
  createOrganization,
  recruitOrganizationMember,
  dismissOrganizationMember,
  createTeam,
  updateTeamMembers,
  sendPartnerInvite,
  dismissPartnerMember,
  updateOrganizationSettings,
  deleteOrganization,
} from '@/features/account/services/account.service';
import type { MemberReference, User, ThemeConfig } from '@/types/domain';

import { useApp } from './use-app';

/**
 * @fileoverview A hook for managing organization-level actions.
 * This hook acts as an intermediary between the UI components and the
 * infrastructure layer (facades), ensuring that components do not
* directly call infrastructure logic. It centralizes all organization-related
 * write operations.
 */
export function useOrganization() {
  const { state: appState } = useApp();
  const { activeAccount } = appState;
  const { state: authState } = useAuth();
  const { user } = authState;

  const orgId = activeAccount?.type === 'organization' ? activeAccount.id : null;

  const createOrganizationFn = useCallback(async (orgName: string) => {
    if (!user) throw new Error("User must be authenticated to create an organization.");
    return createOrganization(orgName, user);
  }, [user]);

  const recruitMember = useCallback(async (newId: string, name: string, email: string) => {
      if (!orgId) throw new Error('No active organization selected');
      return recruitOrganizationMember(orgId, newId, name, email);
    }, [orgId]);

  const dismissMember = useCallback(async (member: MemberReference) => {
      if (!orgId) throw new Error('No active organization selected');
      return dismissOrganizationMember(orgId, member);
    }, [orgId]);

  const createTeamFn = useCallback(async (teamName: string, type: 'internal' | 'external') => {
      if (!orgId) throw new Error('No active organization selected');
      return createTeam(orgId, teamName, type);
    }, [orgId]);

  const updateTeamMembersFn = useCallback(async (teamId: string, memberId: string, action: 'add' | 'remove') => {
      if (!orgId) throw new Error('No active organization selected');
      return updateTeamMembers(orgId, teamId, memberId, action);
    }, [orgId]);
  
  const sendPartnerInviteFn = useCallback(async (teamId: string, email: string) => {
      if (!orgId) throw new Error('No active organization selected');
      return sendPartnerInvite(orgId, teamId, email);
    }, [orgId]);

  const dismissPartnerMemberFn = useCallback(async (teamId: string, member: MemberReference) => {
      if (!orgId) throw new Error('No active organization selected');
      return dismissPartnerMember(orgId, teamId, member);
    }, [orgId]);
    
  const updateOrganizationSettingsFn = useCallback(async (settings: { name?: string; description?: string; theme?: ThemeConfig | null; }) => {
      if (!orgId) throw new Error('No active organization selected');
      return updateOrganizationSettings(orgId, settings);
    }, [orgId]);
    
  const deleteOrganizationFn = useCallback(async () => {
      if (!orgId) throw new Error('No active organization selected');
      return deleteOrganization(orgId);
    }, [orgId]);

  return {
    createOrganization: createOrganizationFn,
    recruitMember,
    dismissMember,
    createTeam: createTeamFn,
    updateTeamMembers: updateTeamMembersFn,
    sendPartnerInvite: sendPartnerInviteFn,
    dismissPartnerMember: dismissPartnerMemberFn,
    updateOrganizationSettings: updateOrganizationSettingsFn,
    deleteOrganization: deleteOrganizationFn,
  };
}
