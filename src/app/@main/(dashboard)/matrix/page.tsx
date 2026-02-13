"use client";
import { MatrixPage } from "@/features/account";

/**
 * @fileoverview Matrix Page Route
 * @description This file serves as the route entry point for `/matrix`.
 * Its sole responsibility is to import and render the actual MatrixPage component
 * from the 'account' feature slice, separating routing from implementation.
 */
export default function Page() {
  return <MatrixPage />;
}
