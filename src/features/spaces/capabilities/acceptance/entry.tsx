"use client";

import { useState, useEffect, useMemo } from "react";

import { Trophy, CheckCircle2, Search, XCircle, AlertTriangle } from "lucide-react";

import { Badge } from "@/app/_components/ui/badge";
import { Button } from "@/app/_components/ui/button";
import { useAuth } from "@/context/auth-context";
import { useSpace } from "@/features/spaces";
import { toast } from "@/hooks/ui/use-toast";
import { SpaceTask } from "@/types/domain";

const getErrorMessage = (error: unknown, fallback: string) =>
  error instanceof Error ? error.message : fallback;

/**
 * SpaceAcceptance - A-Track final delivery threshold.
 * Determines if a task truly qualifies for "Accepted" status.
 * ARCHITECTURE REFACTORED: Now consumes state from context and events.
 */
export default function SpaceAcceptance() {
  const { state: space, logAuditEvent, eventBus, updateTask } = useSpace() as any;
  const { state: { user } } = useAuth();
  
  const initialTasks = useMemo(() => 
    Object.values(space.tasks || {}).filter(
      (task: any) => task.progressState === "verified"
    ), [space.tasks]);

  const [verifiedTasks, setVerifiedTasks] = useState<SpaceTask[]>(initialTasks as any[]);

  useEffect(() => {
    setVerifiedTasks(initialTasks as any[]);
  }, [initialTasks]);


  useEffect(() => {
    const unsubApprove = eventBus.subscribe(
      'space:qa:approved',
      (payload: any) => {
        setVerifiedTasks((prev: any) => {
            if (prev.some((t: any) => t.id === payload.task.id)) return prev;
            return [...prev, payload.task];
        });
      }
    );
    
    const unsubFail = eventBus.subscribe(
      'space:acceptance:failed',
      (payload: any) => {
        setVerifiedTasks((prev: any) => prev.filter((t: any) => t.id !== payload.task.id));
      }
    );
    
     const unsubPass = eventBus.subscribe(
      'space:acceptance:passed',
      (payload: any) => {
        setVerifiedTasks((prev: any) => prev.filter((t: any) => t.id !== payload.task.id));
      }
    );

    return () => {
      unsubApprove();
      unsubFail();
      unsubPass();
    };
  }, [eventBus]);


  const handleAccept = async (task: SpaceTask) => {
    const updates = { progressState: 'accepted' as const };
    
    try {
      await updateTask(task.id, updates);
      eventBus.publish('space:acceptance:passed', {
          task: {...task, ...updates},
          acceptedBy: user?.name || "System"
      });
      logAuditEvent("Final Acceptance Passed", `Task: ${task.name}`, 'update');
      toast({ title: "Task Accepted", description: `${task.name} has passed all dimension verifications.` });
    } catch (error: unknown) {
      console.error("Error accepting task:", error);
      toast({
        variant: "destructive",
        title: "Failed to Accept Task",
        description: getErrorMessage(error, "An unknown error occurred."),
      });
    }
  };

  const handleFail = async (task: SpaceTask) => {
    const updates = { progressState: 'todo' as const };
    
    try {
      await updateTask(task.id, updates);
      eventBus.publish('space:acceptance:failed', {
          task: {...task, ...updates},
          rejectedBy: user?.name || "System"
      });
      logAuditEvent("Acceptance Failed", `Task rolled back: ${task.name}`, 'update');
      toast({ 
        variant: "destructive", 
        title: "Acceptance Failed", 
        description: `${task.name} has been reverted to 'To-Do' and a high-priority issue is being created.` 
      });
    } catch (error: unknown) {
        console.error("Error failing task acceptance:", error);
        toast({
          variant: "destructive",
          title: "Failed to Update Task",
          description: getErrorMessage(error, "An unknown error occurred."),
        });
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-500" /> A-Track: User Acceptance Testing (UAT)
          </h3>
        </div>
        <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20 text-[10px] font-bold">{verifiedTasks.length} Pending</Badge>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {verifiedTasks.map(task => (
          <div key={task.id} className="p-5 bg-card/40 border-2 border-amber-500/10 rounded-2xl flex items-center justify-between group hover:border-amber-500/40 transition-all">
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-amber-900 dark:text-amber-100">{task.name}</h4>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-[7px] bg-green-500/5 text-green-600 border-green-500/20 px-1">QA PASSED</Badge>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 text-destructive/70 hover:bg-destructive/10 hover:text-destructive"
                onClick={() => handleFail(task)}
              >
                <XCircle className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 text-amber-500/70 hover:bg-amber-500/10 hover:text-amber-500"
                onClick={() => handleAccept(task)}
              >
                <CheckCircle2 className="w-5 h-5" />
              </Button>
            </div>
          </div>
        ))}
        {verifiedTasks.length === 0 && (
          <div className="p-12 text-center border-2 border-dashed rounded-2xl opacity-20">
            <Search className="w-8 h-8 mx-auto mb-2" />
            <p className="text-xs font-bold uppercase tracking-widest">No items pending acceptance</p>
          </div>
        )}
      </div>

      <div className="p-4 bg-amber-500/5 border border-amber-500/10 rounded-2xl flex items-start gap-3">
        <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5" />
        <div className="space-y-1">
          <p className="text-[11px] font-bold text-amber-600 uppercase">Acceptance Security Notice</p>
          <p className="text-[10px] text-muted-foreground leading-relaxed">
            Any acceptance failure is treated as a critical spec deviation and will automatically create a high-priority issue on the B-Track for immediate follow-up.
          </p>
        </div>
      </div>
    </div>
  );
}
