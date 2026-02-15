import * as accountRepository from '../repositories/account.repository';
import * as userRepository from '../repositories/user.repository';

// ==================================================================
// == Organization Aggregate Exports
// ==================================================================

export const getOrganizationsQuery = accountRepository.getOrganizationsQuery;
export const createOrganization = accountRepository.createOrganization;
export const recruitOrganizationMember = accountRepository.recruitOrganizationMember;
export const dismissOrganizationMember = accountRepository.dismissOrganizationMember;
export const createTeam = accountRepository.createTeam;
export const updateTeamMembers = accountRepository.updateTeamMembers;
export const sendPartnerInvite = accountRepository.sendPartnerInvite;
export const dismissPartnerMember = accountRepository.dismissPartnerMember;
export const updateOrganizationSettings = accountRepository.updateOrganizationSettings;
export const deleteOrganization = accountRepository.deleteOrganization;

// ==================================================================
// == Organization Sub-Collection Exports
// ==================================================================

export const getDailyLogsQuery = accountRepository.getDailyLogsQuery;
export const getAuditLogsQuery = accountRepository.getAuditLogsQuery;
export const getInvitesQuery = accountRepository.getInvitesQuery;
export const getScheduleItemsQuery = accountRepository.getScheduleItemsQuery;
export const createScheduleItem = accountRepository.createScheduleItem;
export const updateScheduleItemStatus = accountRepository.updateScheduleItemStatus;
export const assignMemberToScheduleItem = accountRepository.assignMemberToScheduleItem;
export const unassignMemberFromScheduleItem = accountRepository.unassignMemberFromScheduleItem;
export const toggleDailyLogLike = accountRepository.toggleDailyLogLike;
export const addDailyLogComment = accountRepository.addDailyLogComment;

// ==================================================================
// == User Aggregate Exports
// ==================================================================

export const getUserProfile = userRepository.getUserProfile;
export const updateUserProfile = userRepository.updateUserProfile;
