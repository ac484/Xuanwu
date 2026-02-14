"use client";

import { useMemo, useState } from "react";

import { AlertCircle, Terminal, Activity } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/app/_components/ui/card";
import { ScrollArea } from "@/app/_components/ui/scroll-area";
import { useOptionalWorkspace } from "@/features/workspaces/_context/workspace-context";
import { useAccount } from "@/hooks/state/use-account";
import { useApp } from "@/hooks/state/use-app";
import { AuditLog } from "@/types/domain";

import { AuditDetailSheet } from "./audit-detail-sheet";
import { AuditEventItem } from "./audit-event-item";
import { AuditTimeline } from "./audit-timeline";
import { AuditTypeIcon } from "./audit-type-icon";

interface AuditViewProps {
  viewMode: 'organization' | 'workspace';
}

export function AuditView({ viewMode }: AuditViewProps) {
  const { state: appState } = useApp();
  const { activeAccount } = appState;
  
  // Data sources
  const accountContext = useAccount();
  const workspaceContext = useOptionalWorkspace();

  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

  const auditLogs = useMemo(() => {
    if (viewMode === 'organization') {
      return Object.values(accountContext.state.auditLogs);
    }
    return workspaceContext?.localAuditLogs || [];
  }, [viewMode, accountContext.state.auditLogs, workspaceContext?.localAuditLogs]);

  if (viewMode === 'organization' && activeAccount?.type !== 'organization') {
    return (
       <div className="p-8 text-center flex flex-col items-center gap-4">
           <AlertCircle className="w-10 h-10 text-muted-foreground" />
           <h3 className="font-bold">Audit Log Not Available</h3>
           <p className="text-sm text-muted-foreground">
               Audit logs are only available within an organization dimension.
           </p>
       </div>
     )
  }
  
  const hasLogs = auditLogs.length > 0;

  if (viewMode === 'workspace') {
      return (
        <div className="animate-in fade-in duration-500">
          <Card className="border-border/60 bg-card/50 backdrop-blur-sm overflow-hidden shadow-sm h-[calc(100vh-20rem)] flex flex-col">
            <CardHeader className="pb-3 bg-primary/5 border-b">
              <CardTitle className="text-[10px] font-bold uppercase tracking-[0.2em] flex items-center gap-2">
                <Activity className="w-4 h-4 text-primary animate-pulse" /> Local Space Pulse
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 flex-1">
              <ScrollArea className="h-full p-6">
                <div className="space-y-6">
                  {auditLogs.map((log) => (
                    <div key={log.id} className="relative pl-8 cursor-pointer" onClick={() => setSelectedLog(log)}>
                      <div className="absolute left-[7px] top-1 h-full w-px bg-border/50" />
                      <div className="absolute left-1.5 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-background border-2 border-primary/40">
                        <AuditTypeIcon type={log.type} />
                      </div>
                      <p className="text-xs font-bold leading-none">{log.action}</p>
                      <p className="text-[10px] text-muted-foreground mt-1">
                        {log.actor} • {log.recordedAt?.seconds ? new Date(log.recordedAt.seconds * 1000).toLocaleTimeString() : "..."}
                      </p>
                    </div>
                  ))}
                  {!hasLogs && (
                    <div className="pt-20 text-center text-xs text-muted-foreground italic opacity-50">
                      No audit events recorded for this space yet.
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
          
          <AuditDetailSheet 
            log={selectedLog}
            isOpen={!!selectedLog}
            onOpenChange={(open) => { if (!open) setSelectedLog(null); }}
          />
        </div>
      );
  }

  return (
    <>
      {hasLogs ? (
        <AuditTimeline>
          {auditLogs.map((log) => (
            <AuditEventItem key={log.id} log={log} onSelect={() => setSelectedLog(log)} />
          ))}
        </AuditTimeline>
      ) : (
        <div className="p-32 text-center flex flex-col items-center justify-center space-y-4 opacity-30">
          <Terminal className="w-12 h-12" />
          <p className="text-sm font-black uppercase tracking-widest">No technical specification changes recorded</p>
        </div>
      )}
      
      <AuditDetailSheet 
        log={selectedLog}
        isOpen={!!selectedLog}
        onOpenChange={(open) => { if (!open) setSelectedLog(null); }}
      />
    </>
  );
}
