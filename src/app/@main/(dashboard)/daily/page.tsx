"use client";

import { OrganizationDailyPage } from "@/features/workspaces/capabilities/daily";

function PageHeader({ title, description }: { title: string; description?: string; }) {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
      <div className="space-y-1">
        <h1 className="text-4xl font-bold tracking-tight font-headline">{title}</h1>
        {description && <p className="text-muted-foreground">{description}</p>}
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <div className="space-y-8 max-w-7xl mx-auto animate-in fade-in duration-700 pb-20">
      <PageHeader
        title="Daily"
        description="Aggregated activity from all personnel across all spaces."
      />
      <OrganizationDailyPage />
    </div>
  );
}
