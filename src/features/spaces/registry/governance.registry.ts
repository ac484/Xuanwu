import { Activity, Users, ShieldCheck, Trophy, AlertCircle } from 'lucide-react';
import dynamic from 'next/dynamic';

import type { CapabilityDetail } from '../capability.model';

/**
 * [Governance] Governance Strategy
 * Defines capabilities related to rules, monitoring, and process control within a space.
 */
export const governanceCapabilities: Record<string, CapabilityDetail> = {
  audit: {
    label: "Audit",
    icon: Activity,
    views: {
      single: { component: dynamic(() => import('@/features/spaces/capabilities/audit').then(mod => mod.SpaceAuditPage)) },
      aggregated: { component: dynamic(() => import('@/features/spaces/capabilities/audit').then(mod => mod.OrganizationAuditPage)) }
    },
  },
  members: {
    label: "Members",
    icon: Users,
    views: {
      single: { component: dynamic(() => import('@/features/spaces/capabilities/members/entry')) },
    },
  },
  qa: {
    label: "QA",
    icon: ShieldCheck,
    views: {
      single: { component: dynamic(() => import('@/features/spaces/capabilities/qa/entry')) },
    },
  },
  acceptance: {
    label: "Acceptance",
    icon: Trophy,
    views: {
      single: { component: dynamic(() => import('@/features/spaces/capabilities/acceptance/entry')) },
    },
  },
  issues: {
    label: "Issues",
    icon: AlertCircle,
    views: {
      single: { component: dynamic(() => import('@/features/spaces/capabilities/issues/entry')) },
    },
  },
};
