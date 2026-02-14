import { businessCapabilities } from './business.registry';
import { governanceCapabilities } from './governance.registry';
import { shellCapabilities } from './shell.registry';

/**
 * The final, aggregated registry of all capabilities available in the system.
 * It combines the shell, governance, and business capabilities into a single source of truth.
 */
export const CAPABILITIES = {
  ...shellCapabilities,
  ...governanceCapabilities,
  ...businessCapabilities,
};
