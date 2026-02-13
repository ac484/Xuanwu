// app/overview/page.tsx
"use client";

// 直接從 component 檔案導入，避免經過可能產生循環引用的 index.ts
import OverviewPage from "@/features/dashboard/components/overview-page";

/**
 * @fileoverview Overview Page Route
 */
export default function Page() {
  return <OverviewPage />;
}