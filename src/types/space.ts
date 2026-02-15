// =================================================================
// == Space Related Types
// =================================================================

import { Address, Capability, Location, ScheduleItem, ScheduleStatus } from "./domain";

export type SpaceRole = 'Manager' | 'Contributor' | 'Viewer';
export type SpaceLifecycleState = 'preparatory' | 'active' | 'stopped';

export interface Space {
  id: string;
  dimensionId: string; // The ID of the User or Organization this space belongs to.
  name: string;
  lifecycleState: SpaceLifecycleState;
  visibility: 'visible' | 'hidden';
  scope: string[];
  protocol: string; // Default protocol template
  capabilities: Capability[];
  grants: SpaceGrant[];
  teamIds: string[];
  tasks?: Record<string, SpaceTask>;
  issues?: Record<string, SpaceIssue>;
  files?: Record<string, SpaceFile>;
  schedule?: Record<string, ScheduleItem>;
  address?: Address; // The physical address of the entire space.
  createdAt: any; // FirestoreTimestamp
}

export interface SpaceGrant {
  grantId: string;
  userId: string;
  role: SpaceRole;
  protocol: string; // Strategy Definition, immutable
  status: 'active' | 'revoked' | 'expired';
  grantedAt: any; // Event Timestamp
  revokedAt?: any; // Event Timestamp
  expiresAt?: any; // State Boundary
}

// Task Management
export interface SpaceTask {
  id: string;
  name: string;
  description?: string;
  progressState: 'todo' | 'doing' | 'completed' | 'verified' | 'accepted';
  priority: 'low' | 'medium' | 'high';
  type?: string;
  progress?: number;
  quantity?: number;
  completedQuantity?: number;
  unitPrice?: number;
  unit?: string;
  discount?: number;
  subtotal: number;
  parentId?: string;
  assigneeId?: string;
  dueDate?: any; // Firestore Timestamp
  photoURLs?: string[];
  location?: Location; // The specific place within the space address.
  createdAt: any; // FirestoreTimestamp
  updatedAt?: any; // FirestoreTimestamp
  [key: string]: any;
}

export interface SpaceIssue {
  id: string;
  title: string;
  type: 'technical' | 'financial';
  priority: 'high' | 'medium';
  issueState: 'open' | 'closed';
  createdAt: any; // FirestoreTimestamp
  comments?: any[]; // IssueComment
}

export interface IssueComment {
    id: string;
    author: string;
    content: string;
    createdAt: any;
}

// File Management
export interface SpaceFileVersion {
  versionId: string;
  versionNumber: number;
  versionName: string;
  size: number;
  uploadedBy: string;
  createdAt: any; // Can be Date for client-side, becomes Timestamp on server
  downloadURL: string;
}

export interface SpaceFile {
  id: string;
  name: string;
  type: string;
  currentVersionId: string;
  updatedAt: any; // Can be Date for client-side, becomes Timestamp on server
  versions: SpaceFileVersion[];
}
