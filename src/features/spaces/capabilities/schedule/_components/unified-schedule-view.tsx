"use client";

import { useState } from "react";

import { addMonths, subMonths } from "date-fns";
import { History, Calendar, ListChecks, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";

import { useOptionalWorkspace } from "@/features/workspaces/_context/workspace-context";
import { useApp } from "@/hooks/state/use-app";
import { toast } from "@/hooks/ui/use-toast";
import type { ScheduleItem, Location, MemberReference } from "@/types/domain";

// UI Components

import { decisionHistoryColumns } from "./decision-history-columns";
import { GovernanceSidebar } from "./governance-sidebar";
import { ProposalDialog } from "./proposal-dialog";
import { ScheduleSection } from "./schedule-section";
import { UnifiedCalendarGrid } from "./unified-calendar-grid";
import { upcomingEventsColumns } from "./upcoming-events-columns";


// Hooks

function PageHeader({ title, description }: { title: string; description?: string; }) {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
      <div className="space-y-1">
        <h1 className="text-4xl font-bold tracking-tight font-headline">{title}</h1>
        {description && <p className="text-muted-foreground">{description}</p>}
      </div>
    </div>
  );
}

interface UnifiedScheduleViewProps {
    viewMode: 'organization' | 'workspace';
    items: ScheduleItem[];
    members: MemberReference[];
    renderItemActions?: (item: ScheduleItem) => React.ReactNode;
    // Organization-specific props
    pendingProposals?: ScheduleItem[];
    decisionHistory?: any[];
    upcomingEvents?: any[];
    presentEvents?: any[];
    onApproveProposal?: (item: ScheduleItem) => void;
    onRejectProposal?: (item: ScheduleItem) => void;
}

/**
 * @fileoverview UnifiedScheduleView - The single, cohesive "engine" for the schedule feature.
 * @description This component is context-aware. It uses the `viewMode` prop to determine
 * which data and actions to load, and which UI elements to render.
 */
export function UnifiedScheduleView({
    viewMode,
    items,
    members,
    renderItemActions,
    pendingProposals = [],
    decisionHistory = [],
    upcomingEvents = [],
    presentEvents = [],
    onApproveProposal = () => {},
    onRejectProposal = () => {},
}: UnifiedScheduleViewProps) {
    const router = useRouter();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [dialogInitialDate, setDialogInitialDate] = useState(new Date());
    
    // Workspace-specific context and actions
    const workspaceContext = useOptionalWorkspace();
    const { createScheduleItem } = workspaceContext || {};
    
    const { state: appState } = useApp();
    const { activeAccount } = appState;

    const handleCreateItem = async (data: { title: string; description?: string; startDate?: Date; endDate?: Date; location: Location; }) => {
        if (viewMode !== 'workspace' || !workspaceContext || !createScheduleItem) return;
        
        const newItemData = {
            accountId: workspaceContext.workspace.dimensionId,
            workspaceId: workspaceContext.workspace.id,
            title: data.title.trim(),
            description: data.description?.trim(),
            startDate: data.startDate,
            endDate: data.endDate,
            location: data.location,
            status: 'PROPOSAL' as const, 
            originType: 'MANUAL' as const,
            assigneeIds: [],
        };
        await createScheduleItem(newItemData as Omit<ScheduleItem, 'id' | 'createdAt' | 'updatedAt'>);
        toast({ title: "Schedule Proposal Sent", description: "Your request has been sent for organization approval." });
        setIsAddDialogOpen(false);
    };

    const handleMonthChange = (direction: 'prev' | 'next') => {
        setCurrentDate(current => direction === 'prev' ? subMonths(current, 1) : addMonths(current, 1));
    };
    
    const handleOpenAddDialog = (date: Date) => {
        setDialogInitialDate(date);
        setIsAddDialogOpen(true);
    };

    const onItemClick = (item: ScheduleItem) => {
        if (viewMode === 'organization') {
            router.push(`/workspaces/${item.workspaceId}?capability=schedule`);
        }
    };
    
    if (viewMode === 'organization' && activeAccount?.type !== 'organization') {
         return (
            <div className="p-8 text-center flex flex-col items-center gap-4">
                <AlertCircle className="w-10 h-10 text-muted-foreground" />
                <h3 className="font-bold">Schedule Not Available</h3>
                <p className="text-sm text-muted-foreground">
                    The organization-wide schedule is only available within an organization dimension.
                </p>
            </div>
        )
    }

    return (
        <div className="space-y-8 h-full">
            {viewMode === 'organization' && (
                <PageHeader 
                    title="Organization Schedule"
                    description="Aggregated view of all proposed and official schedule items across all workspaces."
                />
            )}
            
            <div className="flex-1 rounded-xl border bg-card overflow-hidden flex flex-col md:flex-row min-h-[60vh]">
                 <div className="md:flex-[2] xl:flex-[3] flex flex-col">
                    <div className="flex-1 relative overflow-hidden">
                        <UnifiedCalendarGrid
                            items={items}
                            members={members}
                            viewMode={viewMode}
                            currentDate={currentDate}
                            onMonthChange={handleMonthChange}
                            onItemClick={onItemClick}
                            onAddClick={viewMode === 'workspace' ? handleOpenAddDialog : undefined}
                            onApproveProposal={onApproveProposal}
                            onRejectProposal={onRejectProposal}
                            renderItemActions={renderItemActions}
                        />
                    </div>
                </div>

                {viewMode === 'organization' && (
                    <div className="md:flex-[1] min-w-[300px] border-t md:border-t-0 md:border-l flex flex-col">
                        <GovernanceSidebar 
                            proposals={pendingProposals} 
                            onApprove={onApproveProposal} 
                            onReject={onRejectProposal} 
                        />
                    </div>
                )}
            </div>

            {viewMode === 'organization' && (
                <div className="space-y-8 mt-8">
                    <ScheduleSection 
                        icon={Calendar}
                        title="Future Events"
                        columns={upcomingEventsColumns}
                        data={upcomingEvents}
                    />
                    <ScheduleSection 
                        icon={ListChecks}
                        title="Present Events"
                        columns={upcomingEventsColumns}
                        data={presentEvents}
                    />
                    <ScheduleSection 
                        icon={History}
                        title="Decision History (Last 7 Days)"
                        columns={decisionHistoryColumns}
                        data={decisionHistory}
                    />
                </div>
            )}

            {viewMode === 'workspace' && createScheduleItem && (
                <ProposalDialog
                    isOpen={isAddDialogOpen}
                    onOpenChange={setIsAddDialogOpen}
                    onSubmit={handleCreateItem}
                    initialDate={dialogInitialDate}
                />
            )}
        </div>
    );
}
