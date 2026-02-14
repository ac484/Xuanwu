// [職責] 事件名稱與 Payload 的 TypeScript 類型定義 (Contract)
import type { SpaceTask, DailyLog } from '@/types/domain';

// =================================================================
// == Payload Interfaces
// =================================================================

export interface SpaceTaskCompletedPayload {
  task: SpaceTask;
}

export interface SpaceTaskScheduleRequestedPayload {
  taskName: string;
}

export interface QARejectedPayload {
  task: SpaceTask;
  rejectedBy: string;
}

export interface SpaceAcceptanceFailedPayload {
  task: SpaceTask;
  rejectedBy: string;
}

export interface SpaceQAApprovedPayload {
  task: SpaceTask;
  approvedBy: string;
}

export interface SpaceAcceptancePassedPayload {
  task: SpaceTask;
  acceptedBy: string;
}

export interface DocumentParserItemsExtractedPayload {
  sourceDocument: string;
  items: Array<{
    name: string;
    quantity: number;
    unitPrice: number;
    discount?: number;
    subtotal: number;
  }>;
}

export interface DailyLogForwardRequestedPayload {
    log: DailyLog;
    targetCapability: 'tasks' | 'issues';
    action: 'create';
}

// =================================================================
// Event Name Registry (Discriminated Union)
// =================================================================

export type SpaceEventName =
  | 'space:tasks:completed'
  | 'space:tasks:scheduleRequested'
  | 'space:qa:rejected'
  | 'space:acceptance:failed'
  | 'space:qa:approved'
  | 'space:acceptance:passed'
  | 'space:document-parser:itemsExtracted'
  | 'daily:log:forwardRequested';

// =================================================================
// Event-to-Payload Mapping (Type-Safe Constraint)
// =================================================================

export interface SpaceEventPayloadMap {
  'space:tasks:completed': SpaceTaskCompletedPayload;
  'space:tasks:scheduleRequested': SpaceTaskScheduleRequestedPayload;
  'space:qa:rejected': QARejectedPayload;
  'space:acceptance:failed': SpaceAcceptanceFailedPayload;
  'space:qa:approved': SpaceQAApprovedPayload;
  'space:acceptance:passed': SpaceAcceptancePassedPayload;
  'space:document-parser:itemsExtracted': DocumentParserItemsExtractedPayload;
  'daily:log:forwardRequested': DailyLogForwardRequestedPayload;
}

export type SpaceEventPayload<T extends SpaceEventName> =
  SpaceEventPayloadMap[T];

// =================================================================
// Handler and Function Type Definitions
// =================================================================

export type SpaceEventHandler<T extends SpaceEventName> = (
  payload: SpaceEventPayload<T>
) => Promise<void> | void;

export type PublishFn = <T extends SpaceEventName>(
  type: T,
  payload: SpaceEventPayload<T>
) => void;

export type SubscribeFn = <T extends SpaceEventName>(
  type: T,
  handler: (payload: SpaceEventPayloadMap[T]) => void
) => () => void; // Returns an unsubscribe function
