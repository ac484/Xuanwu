"use client";

import { FileUploadCard } from "./components/file-upload-card";
import { ResultsCard } from "./components/results-card";

export default function DashboardPage() {
  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-1 lg:sticky lg:top-24">
          <FileUploadCard />
        </div>
        <div className="lg:col-span-2">
          <ResultsCard />
        </div>
      </div>
    </div>
  );
}
