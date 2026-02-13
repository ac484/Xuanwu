/**
 * @fileoverview Header Route Entry Point
 * @description This file serves as the route entry point for the `@header` parallel route.
 * Its sole responsibility is to import and render the actual HeaderPage component
 * from the 'layout' feature slice. This keeps the `app` directory clean and
 * separates routing concerns from implementation logic.
 */
import { HeaderPage } from '@/features/layout';

export default function Page() {
  return <HeaderPage />;
}
