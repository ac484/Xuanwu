"use client";
import { MembersPage } from "@/features/account";

/**
 * @fileoverview Members Page Route
 * @description This file serves as the route entry point for `/members`.
 * Its sole responsibility is to import and render the actual MembersPage component
 * from the 'account' feature slice, separating routing from implementation.
 */
export default function Page() {
  return <MembersPage />;
}
