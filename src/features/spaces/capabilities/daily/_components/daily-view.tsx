"use client";

import { useState, useMemo } from "react";

import { AlertCircle, MessageSquare } from "lucide-react";

import { useAuth } from "@/context/auth-context";
import { useOptionalWorkspace, WorkspaceContextShell } from "@/features/workspaces";
import { useLogger } from "@/features/workspaces";
import { useAccount } from "@/hooks/state/use-account";
import { useApp } from "@/hooks/state/use-app";
import { toast } from "@/hooks/ui/use-toast";
import { DailyLog } from "@/types/domain";

import { useAggregatedLogs } from "../_hooks/use-aggregated-logs";
import { useDailyUpload } from "../_hooks/use-daily-upload";

import { DailyLogComposer } from "./composer";
import { DailyLogCard } from "./daily-log-card";
import { DailyLogDialog } from "./daily-log-dialog";


const getErrorMessage = (error: unknown, fallback: string) =>
  error instanceof Error ? error.message : fallback;

interface DailyViewProps {
  viewMode: 'organization' | 'workspace';
}

export function DailyView({ viewMode }: DailyViewProps) {
  // Common Hooks
  const { state: authState } = useAuth();
  const { user } = authState;
  const [selectedLog, setSelectedLog] = useState<DailyLog | null>(null);

  // Organization View specific hooks and data
  const { state: appState } = useApp();
  const { activeAccount } = appState;
  const { logs: aggregatedLogs } = useAggregatedLogs();

  // Workspace View specific hooks and data
  const workspaceContext = useOptionalWorkspace();
  const accountState = useAccount();
  
  const [content, setContent] = useState("");
  const [photos, setPhotos] = useState<File[]>([]);

  const { isUploading, upload } = workspaceContext ? useDailyUpload() : { isUploading: false, upload: async () => [] };
  const { logDaily } = workspaceContext ? useLogger(workspaceContext.workspace.id, workspaceContext.workspace.name) : { logDaily: async () => {} };

  const localLogs = useMemo(() => {
    if (!workspaceContext) return [];
    return Object.values(accountState.state.dailyLogs as Record<string, DailyLog>)
        .filter(log => log.workspaceId === workspaceContext.workspace.id)
        .sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
  }, [accountState.state.dailyLogs, workspaceContext?.workspace.id]);

  const handlePost = async () => {
    if (!workspaceContext || (!content.trim() && photos.length === 0)) return;
    if (!user) {
        toast({ variant: "destructive", title: "Authentication Error", description: "You must be logged in to post."});
        return;
    }
    
    try {
      const photoURLs = await upload(photos);
      await logDaily(content, photoURLs, user);
      
      setContent("");
      setPhotos([]);
      toast({ title: "Daily log posted successfully."});
    } catch (error: unknown) {
      console.error("Error posting daily log:", error);
      toast({
        variant: "destructive",
        title: "Post Failed",
        description: getErrorMessage(error, "An unknown error occurred."),
      });
    }
  };


  if (viewMode === 'organization') {
    if (activeAccount?.type !== 'organization') {
        return (
          <div className="p-8 text-center flex flex-col items-center gap-4">
            <AlertCircle className="w-10 h-10 text-muted-foreground" />
            <h3 className="font-bold">Activity Log Not Available</h3>
            <p className="text-sm text-muted-foreground">
              Daily activity logs are only available within an organization dimension.
            </p>
          </div>
        )
    }

    return (
        <>
          {aggregatedLogs.length > 0 ? (
            <div className="columns-1 md:columns-2 xl:columns-3 gap-6 space-y-6 pb-20">
              {aggregatedLogs.map(log => (
                <div key={log.id} className="break-inside-avoid mb-6">
                  <DailyLogCard log={log} currentUser={user} onOpen={() => setSelectedLog(log)} />
                </div>
              ))}
            </div>
          ) : (
            <div className="p-32 text-center flex flex-col items-center justify-center space-y-6 opacity-30">
              <div className="p-6 bg-muted/20 rounded-full border-2 border-dashed">
                <MessageSquare className="w-16 h-16 text-muted-foreground" />
              </div>
              <p className="text-xl font-bold uppercase tracking-[0.2em]">Activity Void</p>
            </div>
          )}
          {selectedLog && (
            <WorkspaceContextShell workspaceId={selectedLog.workspaceId}>
                <DailyLogDialog
                    log={selectedLog}
                    currentUser={user}
                    isOpen={!!selectedLog}
                    onOpenChange={(open) => !open && setSelectedLog(null)}
                />
            </WorkspaceContextShell>
          )}
        </>
      );
  }

  // Workspace View
  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-500">
      <DailyLogComposer
        content={content}
        setContent={setContent}
        photos={photos}
        setPhotos={setPhotos}
        onSubmit={handlePost}
        isSubmitting={isUploading}
      />

      <div className="space-y-6">
        {localLogs.map(log => (
            <DailyLogCard 
              key={log.id} 
              log={log} 
              currentUser={user}
              onOpen={() => setSelectedLog(log)}
            />
        ))}
        {localLogs.length === 0 && (
          <div className="p-12 text-center flex flex-col items-center gap-3 opacity-20">
            <MessageSquare className="w-12 h-12" />
            <p className="text-[10px] font-black uppercase tracking-widest">No activity recorded in this space yet.</p>
          </div>
        )}
      </div>

       <DailyLogDialog
        log={selectedLog}
        currentUser={user}
        isOpen={!!selectedLog}
        onOpenChange={(open) => !open && setSelectedLog(null)}
      />
    </div>
  );
}
