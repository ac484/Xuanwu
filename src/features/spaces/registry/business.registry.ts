import { FileText, ListTodo, Landmark, MessageSquare, Calendar, FileScan } from 'lucide-react';
import dynamic from 'next/dynamic';

import type { CapabilityDetail } from '../capability.model';

/**
 * [Business] Business Function List
 * Defines capabilities that provide direct business value and productivity tools.
 */
export const businessCapabilities: Record<string, CapabilityDetail> = {
  files: {
    label: "Files",
    icon: FileText,
    views: {
      single: { component: dynamic(() => import('@/features/spaces/capabilities/files/entry')) },
    },
  },
  tasks: {
    label: "Tasks",
    icon: ListTodo,
    views: {
      single: { component: dynamic(() => import('@/features/spaces/capabilities/tasks').then(mod => mod.WorkspaceTasks)) },
    },
  },
  finance: {
    label: "Finance",
    icon: Landmark,
    views: {
      single: { component: dynamic(() => import('@/features/spaces/capabilities/finance/entry')) },
    },
  },
  daily: {
    label: "Daily",
    icon: MessageSquare,
    views: {
      single: { component: dynamic(() => import('@/features/spaces/capabilities/daily').then(mod => mod.SpaceDailyPage)) },
      aggregated: { component: dynamic(() => import('@/features/spaces/capabilities/daily').then(mod => mod.OrganizationDailyPage)) },
    },
  },
  schedule: {
    label: "Schedule",
    icon: Calendar,
    views: {
      single: { component: dynamic(() => import('@/features/spaces/capabilities/schedule').then(mod => mod.SpaceSchedulePage)) },
      aggregated: { component: dynamic(() => import('@/features/spaces/capabilities/schedule').then(mod => mod.OrganizationSchedulePage)) },
    },
  },
  'document-parser': {
    label: "Document Parser",
    icon: FileScan,
    views: {
      single: { component: dynamic(() => import('@/features/spaces/capabilities/document-parser/space-document-parser')) },
    },
  },
};
