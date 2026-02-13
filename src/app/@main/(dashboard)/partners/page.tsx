"use client";
import { PartnersPage } from "@/features/account";

/**
 * @fileoverview Partners Page Route
 * @description This file serves as the route entry point for `/partners`.
 * Its sole responsibility is to import and render the actual PartnersPage component
 * from the 'account' feature slice, separating routing from implementation.
 */
export default function Page() {
  return <PartnersPage />;
}
