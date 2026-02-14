"use client";

import { ColumnDef } from "@tanstack/react-table";
import { LucideIcon } from "lucide-react";

import { ScheduleDataTable } from "./schedule-data-table";

interface ScheduleSectionProps<TData, TValue> {
  icon: LucideIcon;
  title: string;
  data: TData[];
  columns: ColumnDef<TData, TValue>[];
}

/**
 * @fileoverview ScheduleSection - A reusable component to display a titled data table.
 * @description This component abstracts the pattern of a section header followed by
 * a data table, reducing code duplication in the main schedule page.
 */
export function ScheduleSection<TData, TValue>({
  icon: Icon,
  title,
  data,
  columns,
}: ScheduleSectionProps<TData, TValue>) {
  return (
    <div>
      <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2 mb-4">
        <Icon className="w-4 h-4" />
        {title}
      </h3>
      <ScheduleDataTable columns={columns} data={data} />
    </div>
  );
}
