"use client";

import { OrganizationSchedulePage } from "@/features/spaces/capabilities/schedule";

/**
 * @fileoverview Organization Schedule Route
 * @description This file serves as the route entry point for `/schedule`.
 * Its sole responsibility is to import and render the actual OrganizationSchedulePage component
 * from the 'schedule' feature slice, separating routing from implementation.
 */
export default function Page() {
  return <OrganizationSchedulePage />;
}
