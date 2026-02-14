// [職責] 列表頁入口：負責 Data Fetching 與佈局組合
"use client";

import { useState, useEffect } from "react";
import { Terminal } from "lucide-react";
import { useApp } from "@/hooks/state/use-app";
import { useI18n } from "@/features/core/i18n/i18n-context";
import { useVisibleWorkspaces } from "@/hooks/state/use-visible-workspaces";
import { useWorkspaceFilters } from "../_hooks/use-workspace-filters";
import { WorkspaceListHeader } from "../_components/list/workspace-list-header";
import { WorkspaceGridView } from "../_components/list/workspace-grid-view";
import { WorkspaceTableView } from "../_components/list/workspace-table-view";
import { Button } from "@/app/_components/ui/button";
import { CreateWorkspaceDialog } from "../_components/list/create-workspace-dialog";
import { Workspace } from "@/types/domain";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/app/_components/ui/dialog";
import { handleDeleteWorkspace } from "../_actions/workspace-actions";


export function WorkspacesPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [mounted, setMounted] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  
  const [workspaceToDelete, setWorkspaceToDelete] = useState<Workspace | null>(null);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);

  const { t } = useI18n();
  const { state: appState } = useApp();
  const { activeAccount } = appState;
  const allVisibleWorkspaces = useVisibleWorkspaces();
  const filteredWorkspaces = useWorkspaceFilters(
    allVisibleWorkspaces,
    searchQuery
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleOpenDelete = (workspace: Workspace) => {
    setWorkspaceToDelete(workspace);
  };
  
  const handleConfirmDelete = async () => {
    if (!workspaceToDelete) return;
    setIsDeleteLoading(true);
    await handleDeleteWorkspace(workspaceToDelete.id, workspaceToDelete.name, () => {
      setWorkspaceToDelete(null);
    });
    setIsDeleteLoading(false);
  };


  if (!mounted || !activeAccount) return null;

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-in fade-in duration-500 gpu-accelerated">
      <WorkspaceListHeader
        activeAccountName={activeAccount.name}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
      />

      {filteredWorkspaces.length > 0 ? (
        viewMode === "grid" ? (
          <WorkspaceGridView workspaces={filteredWorkspaces} onOpenDelete={handleOpenDelete} />
        ) : (
          <WorkspaceTableView workspaces={filteredWorkspaces} onOpenDelete={handleOpenDelete} />
        )
      ) : (
        <div className="p-24 text-center border-2 border-dashed rounded-3xl bg-muted/5 border-border/40">
          <Terminal className="w-16 h-16 text-muted-foreground mx-auto mb-6 opacity-10" />
          <h3 className="text-2xl font-bold font-headline mb-2">
            {t("workspaces.spaceVoid")}
          </h3>
          <p className="text-muted-foreground max-w-sm mx-auto mb-8 text-sm">
            {t("workspaces.noSpacesFound")}
          </p>
          <Button
            size="lg"
            className="rounded-full px-8 shadow-lg font-bold uppercase tracking-widest text-xs"
            onClick={() => setIsCreateOpen(true)}
          >
            {t("workspaces.createInitialSpace")}
          </Button>
          <CreateWorkspaceDialog open={isCreateOpen} onOpenChange={setIsCreateOpen} />
        </div>
      )}
      
      <Dialog open={!!workspaceToDelete} onOpenChange={(open) => !open && setWorkspaceToDelete(null)}>
        <DialogContent className="rounded-2xl">
           <DialogHeader>
              <DialogTitle className="text-destructive font-headline text-xl">
              Initiate Workspace Destruction Protocol
              </DialogTitle>
          </DialogHeader>
          <div className="py-4 p-4 bg-destructive/5 rounded-2xl border border-destructive/20 text-[11px] text-destructive italic">
              This action will permanently erase the workspace node "
              {workspaceToDelete?.name}" and all its subordinate atomic data and technical
              specifications.
          </div>
          <DialogFooter>
              <Button variant="outline" onClick={() => setWorkspaceToDelete(null)} disabled={isDeleteLoading}>
              Cancel
              </Button>
              <Button variant="destructive" onClick={handleConfirmDelete} disabled={isDeleteLoading}>
              {isDeleteLoading ? 'Destroying...' : 'Confirm Destruction'}
              </Button>
          </DialogFooter>
        </DialogContent>
    </Dialog>
    </div>
  );
}
