// [職責] 為工作區提供一個獨立的 Event Bus 實例的 Context
"use client";

import { createContext } from "react";
import { WorkspaceEventBus } from "@/features/workspaces/_events/workspace-event-bus";

export const EventBusContext = createContext<WorkspaceEventBus | null>(null);
