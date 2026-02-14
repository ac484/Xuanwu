// [職責] 網格佈局容器
"use client";

import type { Space } from "@/types/domain";
import { SpaceCard } from "./space-card";

interface SpaceGridViewProps {
  spaces: Space[];
  onOpenDelete: (space: Space) => void;
}

export function SpaceGridView({ spaces, onOpenDelete }: SpaceGridViewProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {spaces.map((s) => (
        <SpaceCard 
          key={s.id} 
          space={s} 
          onOpenDelete={onOpenDelete}
        />
      ))}
    </div>
  );
}
