// [職責] 封裝搜尋與過濾邏輯
"use client";

import { useMemo, useDeferredValue } from "react";

import type { Space } from "@/types/domain";

export function useSpaceFilters(
  spaces: Space[],
  searchQuery: string
) {
  const deferredSearch = useDeferredValue(searchQuery);
  const searchValue = deferredSearch.toLowerCase();

  const filteredSpaces = useMemo(
    () =>
      spaces.filter((s) => s.name.toLowerCase().includes(searchValue)),
    [spaces, searchValue]
  );

  return filteredSpaces;
}
