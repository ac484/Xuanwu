import { ReactNode } from "react";

/**
 * This layout is required for the (dashboard) route group to correctly
 * render its parallel routes (@main, @sidebar, @header). It does not
 * render any visible UI itself but provides the necessary structural
 * context for Next.js's App Router.
 */
export default function DashboardLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
