/**
 * @fileoverview Space Service
 *
 * This file provides a high-level interface for space-related data operations.
 * It abstracts the underlying repository structure and provides a unified
 * entry point for all space-related business logic.
 */
import * as repositories from '../repositories';

// ==================================================================
// == Space Aggregate Exports
// ==================================================================

export const getSpacesQuery = repositories.getSpacesQuery;
export const createSpace = repositories.createSpace;
export const authorizeSpaceTeam = repositories.authorizeSpaceTeam;
export const revokeSpaceTeam = repositories.revokeSpaceTeam;
export const grantIndividualSpaceAccess =
  repositories.grantIndividualSpaceAccess;
export const revokeIndividualSpaceAccess =
  repositories.revokeIndividualSpaceAccess;
export const mountCapabilities = repositories.mountCapabilities;
export const unmountCapability = repositories.unmountCapability;
export const updateSpaceSettings = repositories.updateSpaceSettings;
export const deleteSpace = repositories.deleteSpace;


// ==================================================================
// == Space Sub-Collection Exports
// ==================================================================

// Issues
export const createIssue = repositories.createIssue;
export const addCommentToIssue = repositories.addCommentToIssue;

// Tasks
export const createTask = repositories.createTask;
export const updateTask = repositories.updateTask;
export const deleteTask = repositories.deleteTask;
