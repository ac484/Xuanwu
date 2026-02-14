import dynamic from 'next/dynamic';
import type { CapabilityDetail } from '../capability.model';
import { Activity, Users, ShieldCheck, Trophy, AlertCircle } from 'lucide-react';

/**
 * [Governance] Governance Strategy
 * Defines capabilities related to rules, monitoring, and process control within a workspace.
 */
export const governanceCapabilities: Record<string, CapabilityDetail> = {
  audit: {
    label: "Audit",
    icon: Activity,
    views: {
      single: { component: dynamic(() => import('@/features/workspaces/capabilities/audit/entry')) },
      aggregated: { component: dynamic(() => import('@/features/workspaces/capabilities/audit').then(mod => mod.OrganizationAuditPage)) }
    },
  },
  members: {
    label: "Members",
    icon: Users,
    views: {
      single: { component: dynamic(() => import('@/features/workspaces/capabilities/members/entry')) },
    },
  },
  qa: {
    label: "QA",
    icon: ShieldCheck,
    views: {
      single: { component: dynamic(() => import('@/features/workspaces/capabilities/qa/entry')) },
    },
  },
  acceptance: {
    label: "Acceptance",
    icon: Trophy,
    views: {
      single: { component: dynamic(() => import('@/features/workspaces/capabilities/acceptance/entry')) },
    },
  },
  issues: {
    label: "Issues",
    icon: AlertCircle,
    views: {
      single: { component: dynamic(() => import('@/features/workspaces/capabilities/issues/entry')) },
    },
  },
};
