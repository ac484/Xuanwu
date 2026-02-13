"use client";
import { TeamDetailPage } from "@/features/account";

/**
 * @fileoverview Team Detail Page Route
 * @description This file serves as the route entry point for `/teams/[id]`.
 * Its sole responsibility is to import and render the actual TeamDetailPage component
 * from the 'account' feature slice, separating routing from implementation.
 */
export default function Page() {
  return <TeamDetailPage />;
}
