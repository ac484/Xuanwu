"use client";

import { useContext } from "react";
import { useMemo } from "react";

import { Layers, ListTodo, AlertCircle } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/app/_components/ui/card";
import { Progress } from "@/app/_components/ui/progress";
import { WorkspaceContext } from "@/features/workspaces/_context/workspace-context";



function useWorkspace() {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error("useWorkspace must be used within a WorkspaceProvider");
  }
  return context.state;
}

function StatCard({ icon, title, value, description, progress }: { icon: React.ReactNode, title: string, value: string, description: string, progress?: number }) {
  return (
    <Card className="border-border/60 shadow-sm hover:shadow-md transition-all duration-300">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-widest">{title}</CardTitle>
        <div className="text-primary">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold font-headline">{value}</div>
        <p className="text-[10px] text-muted-foreground mt-1">{description}</p>
        {progress !== undefined && (
          <div className="mt-4 space-y-2">
            <Progress value={progress} className="h-1" />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function WorkspaceOverview() {
  const { workspace } = useWorkspace() as any;

  const taskStats = useMemo(() => {
    const tasks = Object.values(workspace.tasks || {});
    const total = tasks.length;
    if (total === 0) return { total: 0, completed: 0, progress: 0 };
    const completed = tasks.filter((t: any) => ['completed', 'verified', 'accepted'].includes(t.progressState)).length;
    const progress = Math.round((completed / total) * 100);
    return { total, completed, progress };
  }, [workspace.tasks]);
  
  const issueStats = useMemo(() => {
    const issues = Object.values(workspace.issues || {});
    const total = issues.length;
    const open = issues.filter((i: any) => i.issueState === 'open').length;
    return { total, open };
  }, [workspace.issues]);


  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          icon={<Layers className="w-4 h-4" />}
          title="Mounted Capabilities"
          value={workspace.capabilities.length.toString()}
          description="Atomic functions active in this space."
        />
        <StatCard
          icon={<ListTodo className="w-4 h-4" />}
          title="Task Progress"
          value={`${taskStats.completed} / ${taskStats.total}`}
          description="Total tasks completed in this workspace."
          progress={taskStats.progress}
        />
        <StatCard
          icon={<AlertCircle className="w-4 h-4" />}
          title="Open Issues"
          value={issueStats.open.toString()}
          description="Anomalies requiring governance."
        />
      </div>
       <Card className="border-border/60 shadow-sm">
        <CardHeader>
            <CardTitle>Workspace State</CardTitle>
        </CardHeader>
        <CardContent>
            <pre className="text-xs p-4 bg-muted rounded-md max-h-[500px] overflow-auto">
              {JSON.stringify(workspace, null, 2)}
            </pre>
        </CardContent>
      </Card>
    </div>
  );
}
