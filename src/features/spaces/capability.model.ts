import type { ComponentType } from 'react';

/**
 * [Core] Defines the standard structure for a capability view.
 * This is the atomic unit of UI that a capability can expose.
 */
export interface CapabilityView {
  component: ComponentType<any>;
}

/**
 * [Core] Defines the standard structure for a capability.
 * This is the central schema that the entire system must adhere to.
 * It supports different component views for different contexts 
 * (e.g., `single` space vs. `aggregated` organization view),
 * making the capability definition itself context-aware.
 */
export interface CapabilityDetail {
  label: string;
  icon: ComponentType<any>;
  views: {
    single: CapabilityView; // View for a single space context
    aggregated?: CapabilityView; // Optional aggregated view for an organizational context
  };
}
