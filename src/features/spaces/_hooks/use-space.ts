// [職責] 提供一個掛鉤，讓子元件可以輕鬆存取空間的狀態和調度。
"use client";

import { useContext } from "react";

import { SpaceContext } from "@/features/spaces/_context/space-context";

export function useSpace() {
  const context = useContext(SpaceContext);
  if (!context) {
    throw new Error("useSpace must be used within a SpaceContext.Provider\n");
  }
  return context;
}

export function useOptionalSpace() {
  return useContext(SpaceContext);
}
