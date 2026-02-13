/**
 * @fileoverview Sidebar Route Entry Point
 * @description This file serves as the route entry point for the `@sidebar` parallel route.
 * Its sole responsibility is to import and render the actual SidebarPage component
 * from the 'layout' feature slice. This keeps the `app` directory clean and
 * separates routing concerns from implementation logic.
 */
import { SidebarPage } from '@/features/layout';

export default function Page() {
  return <SidebarPage />;
}
