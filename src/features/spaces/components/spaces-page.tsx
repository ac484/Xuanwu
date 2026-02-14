// [職責] 列表頁入口：負責 Data Fetching 與佈局組合
"use client";

import { useState, useEffect } from "react";
import { Terminal } from "lucide-react";
import { useApp } from "@/hooks/state/use-app";
import { useI18n } from "@/features/core/i18n/i18n-context";
import { useVisibleWorkspaces } from "@/hooks/state/use-visible-workspaces";
import { useSpaceFilters } from "../_hooks/use-space-filters";
import { SpaceListHeader } from "../_components/list/space-list-header";
import { SpaceGridView } from "../_components/list/space-grid-view";
import { SpaceTableView } from "../_components/list/space-table-view";
import { Button } from "@/app/_components/ui/button";
import { CreateSpaceDialog } from "../_components/list/create-space-dialog";
import { Workspace } from "@/types/domain";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/app/_components/ui/dialog";
import { handleDeleteSpace } from "../_actions/space-actions";


export function SpacesPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [mounted, setMounted] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  
  const [spaceToDelete, setSpaceToDelete] = useState<Workspace | null>(null);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);

  const { t } = useI18n();
  const { state: appState } = useApp();
  const { activeAccount } = appState;
  const allVisibleSpaces = useVisibleWorkspaces();
  const filteredSpaces = useSpaceFilters(
    allVisibleSpaces,
    searchQuery
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleOpenDelete = (space: Workspace) => {
    setSpaceToDelete(space);
  };
  
  const handleConfirmDelete = async () => {
    if (!spaceToDelete) return;
    setIsDeleteLoading(true);
    await handleDeleteSpace(spaceToDelete.id, spaceToDelete.name, () => {
      setSpaceToDelete(null);
    });
    setIsDeleteLoading(false);
  };


  if (!mounted || !activeAccount) return null;

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-in fade-in duration-500 gpu-accelerated">
      <SpaceListHeader
        activeAccountName={activeAccount.name}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
      />

      {filteredSpaces.length > 0 ? (
        viewMode === "grid" ? (
          <SpaceGridView spaces={filteredSpaces} onOpenDelete={handleOpenDelete} />
        ) : (
          <SpaceTableView spaces={filteredSpaces} onOpenDelete={handleOpenDelete} />
        )
      ) : (
        <div className="p-24 text-center border-2 border-dashed rounded-3xl bg-muted/5 border-border/40">
          <Terminal className="w-16 h-16 text-muted-foreground mx-auto mb-6 opacity-10" />
          <h3 className="text-2xl font-bold font-headline mb-2">
            {t("spaces.spaceVoid")}
          </h3>
          <p className="text-muted-foreground max-w-sm mx-auto mb-8 text-sm">
            {t("spaces.noSpacesFound")}
          </p>
          <Button
            size="lg"
            className="rounded-full px-8 shadow-lg font-bold uppercase tracking-widest text-xs"
            onClick={() => setIsCreateOpen(true)}
          >
            {t("spaces.createInitialSpace")}
          </Button>
          <CreateSpaceDialog open={isCreateOpen} onOpenChange={setIsCreateOpen} />
        </div>
      )}
      
      <Dialog open={!!spaceToDelete} onOpenChange={(open) => !open && setSpaceToDelete(null)}>
        <DialogContent className="rounded-2xl">
           <DialogHeader>
              <DialogTitle className="text-destructive font-headline text-xl">
              Initiate Space Destruction Protocol
              </DialogTitle>
          </DialogHeader>
          <div className="py-4 p-4 bg-destructive/5 rounded-2xl border border-destructive/20 text-[11px] text-destructive italic">
              This action will permanently erase the space node "
              {spaceToDelete?.name}" and all its subordinate atomic data and technical
              specifications.
          </div>
          <DialogFooter>
              <Button variant="outline" onClick={() => setSpaceToDelete(null)} disabled={isDeleteLoading}>
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
