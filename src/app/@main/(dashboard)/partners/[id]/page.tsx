"use client";
import { PartnerDetailPage } from "@/features/account";

/**
 * @fileoverview Partner Detail Page Route
 * @description This file serves as the route entry point for `/partners/[id]`.
 * Its sole responsibility is to import and render the actual PartnerDetailPage component
 * from the 'account' feature slice, separating routing from implementation.
 */
export default function Page() {
  return <PartnerDetailPage />;
}
