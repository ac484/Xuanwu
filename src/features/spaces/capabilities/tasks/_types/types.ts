import type { SpaceTask } from "@/types/domain";

export type TaskWithChildren = SpaceTask & {
  children: TaskWithChildren[];
  descendantSum: number;
  wbsNo: string;
};
