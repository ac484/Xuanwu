"use client";
import { TeamsPage } from "@/features/account";

/**
 * @fileoverview Teams Page Route
 * @description This file serves as the route entry point for `/teams`.
 * Its sole responsibility is to import and render the actual TeamsPage component
 * from the 'account' feature slice, separating routing from implementation.
 */
export default function Page() {
  return <TeamsPage />;
}
