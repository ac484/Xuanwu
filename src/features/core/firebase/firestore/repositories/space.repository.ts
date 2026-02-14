/**
 * @fileoverview Space Repository.
 *
 * This file contains all Firestore write operations related to a single 'spaces'
 * document and all of its sub-collections (tasks, issues, files, etc.).
 * It encapsulates the direct interactions with the Firebase SDK.
 */

import {
  serverTimestamp,
  arrayUnion,
  arrayRemove,
  doc,
  getDoc,
} from 'firebase/firestore';

import type {
  SwitchableAccount,
  Capability,
  Address,
  IssueComment,
} from '@/types/domain';
import type {
  Space,
  SpaceRole,
  SpaceGrant,
  SpaceIssue,
  SpaceTask,
  SpaceLifecycleState,
} from '@/types/space';

import { db } from '../firestore.client';
import {
  updateDocument,
  addDocument,
  deleteDocument,
} from '../firestore.write.adapter';

/**
 * Creates a new space with default values, based on the active account context.
 * @param name The name of the new space.
 * @param account The active account (user or organization) creating the space.
 * @returns The ID of the newly created space.
 */
export const createSpace = async (
  name: string,
  account: SwitchableAccount
): Promise<string> => {
  const spaceData: Omit<Space, 'id'> = {
    name: name.trim(),
    dimensionId: account.id, // The single source of truth for ownership.
    lifecycleState: 'preparatory',
    visibility: account.type === 'organization' ? 'visible' : 'hidden',
    protocol: 'Standard Access Protocol',
    scope: ['Authentication', 'Compute'],
    capabilities: [],
    grants: [],
    teamIds: [],
    createdAt: serverTimestamp(),
  };

  const docRef = await addDocument('spaces', spaceData);
  return docRef.id;
};

/**
 * Authorizes a team to access a space.
 * @param spaceId The ID of the space.
 * @param teamId The ID of the team to authorize.
 */
export const authorizeSpaceTeam = async (
  spaceId: string,
  teamId: string
): Promise<void> => {
  const updates = { teamIds: arrayUnion(teamId) };
  return updateDocument(`spaces/${spaceId}`, updates);
};

/**
 * Revokes a team's access from a space.
 * @param spaceId The ID of the space.
 * @param teamId The ID of the team to revoke.
 */
export const revokeSpaceTeam = async (
  spaceId: string,
  teamId: string
): Promise<void> => {
  const updates = { teamIds: arrayRemove(teamId) };
  return updateDocument(`spaces/${spaceId}`, updates);
};

/**
 * Grants an individual member a specific role in a space.
 * @param spaceId The ID of the space.
 * @param userId The ID of the user to grant access to.
 * @param role The role to grant.
 * @param protocol The access protocol to apply.
 */
export const grantIndividualSpaceAccess = async (
  spaceId: string,
  userId: string,
  role: SpaceRole,
  protocol?: string
): Promise<void> => {
  const newGrant: SpaceGrant = {
    grantId: `grant-${Math.random().toString(36).substring(2, 11)}`,
    userId: userId,
    role: role,
    protocol: protocol || 'Standard Bridge',
    status: 'active',
    grantedAt: serverTimestamp(),
  };
  const updates = { grants: arrayUnion(newGrant) };
  return updateDocument(`spaces/${spaceId}`, updates);
};

/**
 * Revokes an individual's direct access grant from a space.
 * @param spaceId The ID of the space.
 * @param grantId The ID of the grant to revoke.
 */
export const revokeIndividualSpaceAccess = async (
  spaceId: string,
  grantId: string
): Promise<void> => {
  const wsRef = doc(db, 'spaces', spaceId);
  const wsSnap = await getDoc(wsRef);

  if (!wsSnap.exists()) {
    throw new Error('Space not found');
  }

  const space = wsSnap.data() as Space;
  const grants = space.grants || [];
  const updatedGrants = grants.map((g) =>
    g.grantId === grantId
      ? { ...g, status: 'revoked', revokedAt: serverTimestamp() }
      : g
  );

  return updateDocument(`spaces/${spaceId}`, { grants: updatedGrants });
};

/**
 * Creates a new issue in a space (e.g., when a task is rejected).
 */
export const createIssue = async (
  spaceId: string,
  title: string,
  type: 'technical' | 'financial',
  priority: 'high' | 'medium'
): Promise<void> => {
  const issueData: Omit<SpaceIssue, 'id'> = {
    title,
    type,
    priority,
    issueState: 'open',
    createdAt: serverTimestamp(),
    comments: [],
  };
  await addDocument(`spaces/${spaceId}/issues`, issueData);
};

/**
 * Adds a comment to a specific issue.
 */
export const addCommentToIssue = async (
  spaceId: string,
  issueId: string,
  author: string,
  content: string
): Promise<void> => {
  const newComment: IssueComment = {
    id: `comment-${Math.random().toString(36).substring(2, 11)}`,
    author,
    content,
    createdAt: serverTimestamp(),
  };

  await updateDocument(`spaces/${spaceId}/issues/${issueId}`, {
    comments: arrayUnion(newComment),
  });
};

/**
 * Creates a new task in a specific space.
 * @param spaceId The ID of the space.
 * @param taskData The data for the new task.
 * @returns The ID of the newly created task.
 */
export const createTask = async (
  spaceId: string,
  taskData: Omit<SpaceTask, 'id' | 'createdAt' | 'updatedAt'>
): Promise<string> => {
  const dataWithTimestamp = {
    ...taskData,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
  const docRef = await addDocument(
    `spaces/${spaceId}/tasks`,
    dataWithTimestamp
  );
  return docRef.id;
};

/**
 * Updates an existing task in a space.
 * @param spaceId The ID of the space.
 * @param taskId The ID of the task to update.
 * @param updates The fields to update on the task.
 */
export const updateTask = async (
  spaceId: string,
  taskId: string,
  updates: Partial<SpaceTask>
): Promise<void> => {
  const dataWithTimestamp = {
    ...updates,
    updatedAt: serverTimestamp(),
  };
  return updateDocument(
    `spaces/${spaceId}/tasks/${taskId}`,
    dataWithTimestamp
  );
};

/**
 * Deletes a task from a space.
 * @param spaceId The ID of the space.
 * @param taskId The ID of the task to delete.
 */
export const deleteTask = async (
  spaceId: string,
  taskId: string
): Promise<void> => {
  return deleteDocument(`spaces/${spaceId}/tasks/${taskId}`);
};

/**
 * Mounts (adds) capabilities to a space.
 * @param spaceId The ID of the space.
 * @param capabilities An array of capability objects to mount.
 */
export const mountCapabilities = async (
  spaceId: string,
  capabilities: Capability[]
): Promise<void> => {
  const updates = { capabilities: arrayUnion(...capabilities) };
  return updateDocument(`spaces/${spaceId}`, updates);
};

/**
 * Unmounts (removes) a capability from a space.
 * @param spaceId The ID of the space.
 * @param capability The capability object to unmount.
 */
export const unmountCapability = async (
  spaceId: string,
  capability: Capability
): Promise<void> => {
  const updates = { capabilities: arrayRemove(capability) };
  return updateDocument(`spaces/${spaceId}`, updates);
};

/**
 * Updates the settings of a space.
 * @param spaceId The ID of the space.
 * @param settings The settings to update.
 */
export const updateSpaceSettings = async (
  spaceId: string,
  settings: {
    name: string;
    visibility: 'visible' | 'hidden';
    lifecycleState: SpaceLifecycleState;
    address: Address;
  }
): Promise<void> => {
  return updateDocument(`spaces/${spaceId}`, settings);
};

/**
 * Deletes an entire space.
 * @param spaceId The ID of the space to delete.
 */
export const deleteSpace = async (spaceId: string): Promise<void> => {
  // This just deletes the doc. In a real app, we'd need a Cloud Function
  // to delete all subcollections (tasks, issues, etc.).
  return deleteDocument(`spaces/${spaceId}`);
};
