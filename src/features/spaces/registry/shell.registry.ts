import { LayoutDashboard, Layers, Settings } from 'lucide-react';
import dynamic from 'next/dynamic';

import type { CapabilityDetail } from '../capability.model';

/**
 * Defines the shell capabilities, which are fundamental to the space container itself.
 */
export const shellCapabilities: Record<string, CapabilityDetail> = {
  overview: {
    label: "Overview",
    icon: LayoutDashboard,
    views: {
      single: { component: dynamic(() => import('@/features/spaces/capabilities/overview/entry')) },
    },
  },
  capabilities: {
    label: "Capabilities",
    icon: Layers,
    views: {
      single: { component: dynamic(() => import('@/features/spaces/capabilities/capabilities/entry')) },
    },
  },
  settings: {
    label: "Settings",
    icon: Settings,
    views: {
      single: { component: dynamic(() => import('@/features/spaces/capabilities/settings/entry')) },
    },
  },
};
