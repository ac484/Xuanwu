"use client";

import { useMemo } from "react";
import { useAccount } from "@/hooks/state/use-account";
import { DailyLog } from "@/types/domain";

export function useAggregatedLogs() {
  const { state: accountState } = useAccount();
  const { dailyLogs } = accountState;

  const logs = useMemo(() =>
    Object.values(dailyLogs as Record<string, DailyLog>)
      .sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)),
    [dailyLogs]
  );
  
  return { logs };
}
