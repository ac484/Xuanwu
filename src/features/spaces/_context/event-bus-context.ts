// [職責] 為工作區提供一個獨立的 Event Bus 實例的 Context
"use client";

import { createContext } from "react";

import { SpaceEventBus } from "@/features/spaces/_events/space-event-bus";

export const EventBusContext = createContext<SpaceEventBus | null>(null);
