'use client';

import { useState, useMemo, useEffect, useCallback, useContext } from 'react';

import {
  Plus,
  Settings2,
  Coins,
  View,
  BarChart3,
  UploadCloud,
  X,
  Loader2,
  Paperclip,
  MapPin,
} from 'lucide-react';
import Image from "next/image";

import { Button } from '@/app/_components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/app/_components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/app/_components/ui/dropdown-menu';
import { Input } from '@/app/_components/ui/input';
import { Label } from '@/app/_components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/_components/ui/select';
import { Textarea } from '@/app/_components/ui/textarea';
import { WorkspaceContext } from '@/features/workspaces/_context/workspace-context';
import { toast } from '@/hooks/ui/use-toast';
import { WorkspaceTask, Location } from '@/types/domain';

import { ProgressReportDialog } from './_features/progress-report-dialog';
import { TaskItem } from './_features/task-item';
import { useTaskTree } from './_hooks/use-task-tree';
import { useTaskUpload } from './_hooks/use-task-upload';
import { TaskWithChildren } from './_types/types';

const getErrorMessage = (error: unknown, fallback: string) =>
  error instanceof Error ? error.message : fallback;

function useWorkspace() {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error("useWorkspace must be used within a WorkspaceProvider");
  }
  return context;
}

export default function WorkspaceTasks() {
  const { state: workspace, logAuditEvent, eventBus, createTask, updateTask, deleteTask } = useWorkspace() as any;
  const { uploadTaskAttachment } = useTaskUpload();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Partial<WorkspaceTask> | null>(null);
  const [reportingTask, setReportingTask] = useState<TaskWithChildren | null>(null);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [previewingImage, setPreviewingImage] = useState<string | null>(null);
  
  const [photos, setPhotos] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const [visibleColumns, setVisibleColumns] = useState<Set<string>>(
    new Set(['type', 'priority', 'discount', 'subtotal', 'progress', 'status'])
  );

  const tasks = useMemo(
    () =>
      Object.values(workspace.tasks || {}).sort(
        (a: any, b: any) => (a.createdAt?.seconds ?? 0) - (b.createdAt?.seconds ?? 0)
      ),
    [workspace.tasks]
  );

  const tree = useTaskTree(tasks);

  useEffect(() => {
    if (!isAddOpen) {
      setPhotos([]);
    }
  }, [isAddOpen]);

  const handleLocationChange = (field: keyof Location, value: string) => {
    setEditingTask(prev => ({
        ...prev,
        location: {
            ...prev?.location,
            description: prev?.location?.description || '',
            [field]: value
        }
    }))
  };

  const handleSaveTask = async () => {
    if (!editingTask?.name) return;
    setIsUploading(true);

    try {
      const newPhotoURLs = await Promise.all(
        photos.map(photo => uploadTaskAttachment(photo))
      );
      
      const existingPhotoURLs = editingTask.photoURLs || [];
      const finalPhotoURLs = [...existingPhotoURLs, ...newPhotoURLs];

      const subtotal =
        (Number(editingTask.quantity) || 0) *
        (Number(editingTask.unitPrice) || 0) - (Number(editingTask.discount) || 0);

      if (editingTask.parentId) {
        const parent = tasks.find((t: any) => t.id === editingTask.parentId);
        if (parent) {
          const currentChildrenSum = tasks
            .filter(
              (t: any) => t.parentId === editingTask.parentId && t.id !== editingTask.id
            )
            .reduce((acc: any, t: any) => acc + (t.subtotal || 0), 0);

          if (currentChildrenSum + subtotal > (parent.subtotal || 0)) {
            toast({
              variant: 'destructive',
              title: 'Budget Overflow Intercepted',
              description: `Sum of child items cannot exceed the budget limit of "${parent.name}".`,
            });
            setIsUploading(false);
            return;
          }
        }
      }

      if (editingTask.id) {
        const childSum = tasks
          .filter((t: any) => t.parentId === editingTask.id)
          .reduce((acc: any, t: any) => acc + (t.subtotal || 0), 0);
        if (subtotal < childSum) {
          toast({
            variant: 'destructive',
            title: 'Budget Sovereignty Conflict',
            description: `Budget limit ($${subtotal}) cannot be less than the sum of existing child items ($${childSum}).`,
          });
          setIsUploading(false);
          return;
        }
      }

      const finalData: Partial<WorkspaceTask> = {
        ...editingTask,
        subtotal,
        photoURLs: finalPhotoURLs,
        progressState: editingTask.progressState || 'todo',
      };
      delete (finalData as any).progress; // Ensure calculated progress is not saved

      if (editingTask.id) {
        await updateTask(editingTask.id, finalData);
        logAuditEvent('Calibrated WBS Node', `${editingTask.name} [Subtotal: ${subtotal}]`, 'update');
      } else {
        const taskToCreate: Omit<WorkspaceTask, 'id' | 'createdAt' | 'updatedAt'> = {
            ...(finalData as any),
            name: finalData.name!,
            progressState: finalData.progressState!,
            subtotal: finalData.subtotal!,
            completedQuantity: 0,
        };
        await createTask(taskToCreate);
        logAuditEvent('Defined WBS Node', editingTask.name!, 'create');
      }

      setEditingTask(null);
      setIsAddOpen(false);
    } catch (error: unknown) {
      console.error('Error saving task:', error);
      toast({
        variant: 'destructive',
        title: 'Failed to Save Task',
        description: getErrorMessage(error, 'An unknown error occurred.'),
      });
    } finally {
      setIsUploading(false);
    }
  };
  
  const handleReportProgress = async (taskId: string, newCompletedQuantity: number) => {
    try {
      await updateTask(taskId, { completedQuantity: newCompletedQuantity });
      toast({ title: "Progress Updated" });
    } catch (error: unknown) {
      console.error("Error reporting progress:", error);
      toast({
        variant: 'destructive',
        title: 'Failed to Update Progress',
        description: getErrorMessage(error, "An unknown error occurred."),
      });
    }
  };

  const handleSubmitForQA = async (task: TaskWithChildren) => {
    const updates = { progressState: 'completed' as const };
    try {
      await updateTask(task.id, updates);
      eventBus.publish('workspace:tasks:completed', { task: { ...task, ...updates } });
      logAuditEvent('Submitted for QA', task.name, 'update');
      toast({
        title: 'Task Submitted for QA',
        description: `"${task.name}" is now in the QA queue.`,
      });
    } catch (error: unknown) {
      toast({ variant: 'destructive', title: 'Submission Failed', description: getErrorMessage(error, 'An unknown error occurred.') });
    }
  };


  const handleDeleteTask = useCallback(async (node: TaskWithChildren) => {
    if (confirm('Confirm destruction of this node and all its descendants?')) {
      try {
        await deleteTask(node.id);
      } catch (error: unknown) {
        toast({ variant: 'destructive', title: 'Failed to Delete Task', description: getErrorMessage(error, 'An unknown error occurred.') });
      }
    }
  }, [deleteTask]);
  
  const handleScheduleRequest = useCallback((task: WorkspaceTask) => {
    eventBus.publish('workspace:tasks:scheduleRequested', { taskName: task.name! });
    toast({ title: 'Schedule Request Sent', description: `"${task.name}" was sent to the Schedule capability.` });
  }, [eventBus]);

  const toggleColumn = (key: string) => {
    setVisibleColumns(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };
  
  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setPhotos(prev => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const handleRemovePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const toggleExpand = useCallback((taskId: string) => {
    setExpandedIds(prev => {
        const next = new Set(prev);
        if(next.has(taskId)) next.delete(taskId);
        else next.add(taskId);
        return next;
    });
  }, []);

  const handleAddSubtask = useCallback((parentId: string) => {
    setEditingTask({ parentId, quantity: 1, completedQuantity: 0, unitPrice: 0, discount: 0, type: 'Sub-task', priority: 'medium', progressState: 'todo' });
    setIsAddOpen(true);
  }, []);

  const handleEdit = useCallback((task: TaskWithChildren) => {
    setEditingTask({ ...task, location: task.location || { description: '' } });
    setIsAddOpen(true);
  }, []);

  const handlePreviewImage = useCallback((url: string) => {
    setPreviewingImage(url);
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      <div className="flex items-center justify-between bg-card/40 backdrop-blur-md p-4 rounded-3xl border border-primary/20 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-xl text-primary"><BarChart3 className="w-5 h-5" /></div>
          <div>
            <h3 className="text-sm font-black uppercase tracking-widest text-foreground">WBS Governance</h3>
            <p className="text-[9px] text-muted-foreground font-bold uppercase flex items-center gap-2">Real-time Budget & Topology Monitoring</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-9 gap-2 font-black uppercase text-[10px] rounded-xl"><View className="w-3.5 h-3.5" /> View Options</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 rounded-xl">
              <DropdownMenuLabel className="text-[10px] uppercase font-bold">Visible Columns</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {['type', 'priority', 'discount', 'subtotal', 'progress', 'status'].map(col => (
                <DropdownMenuCheckboxItem key={col} checked={visibleColumns.has(col)} onCheckedChange={() => toggleColumn(col)}>{col}</DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button size="sm" className="h-9 gap-2 font-black uppercase text-[10px] rounded-full shadow-lg shadow-primary/20 px-5" onClick={() => {
            setEditingTask({ quantity: 1, completedQuantity: 0, unitPrice: 0, discount: 0, type: 'Top-level Project', priority: 'medium', progressState: 'todo', photoURLs: [], location: { description: '' } });
            setIsAddOpen(true);
          }}>
            <Plus className="w-3.5 h-3.5" /> Create Root Node
          </Button>
        </div>
      </div>

       <ProgressReportDialog task={reportingTask} isOpen={!!reportingTask} onClose={() => setReportingTask(null)} onSubmit={handleReportProgress} />
      
       <Dialog open={!!previewingImage} onOpenChange={(open) => !open && setPreviewingImage(null)}>
        <DialogContent className="max-w-4xl p-1 bg-transparent border-none shadow-none">
          {previewingImage && <div className="relative aspect-video w-full h-auto"><Image src={previewingImage} alt="Attachment preview" fill sizes="100vw" className="object-contain rounded-lg" /></div>}
        </DialogContent>
      </Dialog>
      
      <div className="space-y-1">
        {tree.length > 0 ? (
          tree.map((root) => <TaskItem key={root.id} node={root} expandedIds={expandedIds} visibleColumns={visibleColumns} toggleExpand={toggleExpand} onAddSubtask={handleAddSubtask} onEdit={handleEdit} onDelete={handleDeleteTask} onReportProgress={setReportingTask} onSubmitForQA={handleSubmitForQA} onScheduleRequest={handleScheduleRequest} onPreviewImage={handlePreviewImage} />)
        ) : (
          <div className="p-20 text-center border-2 border-dashed rounded-3xl bg-muted/5 opacity-20 flex flex-col items-center gap-3">
            <Coins className="w-12 h-12" /><p className="text-[10px] font-black uppercase tracking-widest">Awaiting Engineering Node Definition...</p>
          </div>
        )}
      </div>

      <Dialog open={isAddOpen} onOpenChange={(open) => !open && (setEditingTask(null), setIsAddOpen(false))}>
        <DialogContent className="max-w-3xl rounded-[2.5rem] p-0 overflow-hidden border-none shadow-2xl">
          <div className="bg-primary p-8 text-white"><DialogHeader><DialogTitle className="font-headline text-3xl flex items-center gap-3"><Settings2 className="w-8 h-8" /> {editingTask?.id ? 'Calibrate WBS Node' : 'Define New Node'}</DialogTitle></DialogHeader></div>
          <div className="p-8 grid grid-cols-2 gap-6 max-h-[70vh] overflow-y-auto">
            <div className="col-span-2 space-y-1.5"><Label className="text-[10px] font-black uppercase text-muted-foreground ml-1">Task Name</Label><Input value={editingTask?.name || ''} onChange={(e) => setEditingTask({ ...editingTask, name: e.target.value })} className="h-12 rounded-xl bg-muted/30 border-none font-bold" /></div>
            <div className="col-span-2 space-y-1.5"><Label className="text-[10px] font-black uppercase text-muted-foreground ml-1">Description & Specs</Label><Textarea value={editingTask?.description || ''} onChange={(e) => setEditingTask({ ...editingTask, description: e.target.value })} className="rounded-xl bg-muted/30 border-none resize-none min-h-[100px]" /></div>
            <div className="col-span-2 space-y-2"><Label className="text-[10px] font-black uppercase text-muted-foreground ml-1 flex items-center gap-2"><MapPin className="w-3 h-3"/> Location</Label><div className="grid grid-cols-3 gap-4"><Input placeholder="Building" value={editingTask?.location?.building || ''} onChange={(e) => handleLocationChange('building', e.target.value)} className="h-11 rounded-xl bg-muted/30 border-none" /><Input placeholder="Floor" value={editingTask?.location?.floor || ''} onChange={(e) => handleLocationChange('floor', e.target.value)} className="h-11 rounded-xl bg-muted/30 border-none" /><Input placeholder="Room" value={editingTask?.location?.room || ''} onChange={(e) => handleLocationChange('room', e.target.value)} className="h-11 rounded-xl bg-muted/30 border-none" /></div><Textarea placeholder="Location details (e.g., 'Behind the main server rack')" value={editingTask?.location?.description || ''} onChange={(e) => handleLocationChange('description', e.target.value)} className="rounded-xl bg-muted/30 border-none resize-none" rows={2} /></div>
            
            <div className="col-span-2 space-y-3"><Label className="text-[10px] font-black uppercase text-muted-foreground ml-1 flex items-center gap-2"><Paperclip className="w-3 h-3"/> Attachments</Label>{editingTask?.photoURLs && editingTask.photoURLs.length > 0 && (<div className="grid grid-cols-4 gap-2">{editingTask.photoURLs.map((url, index) => (<div key={index} className="relative group aspect-square"><Image src={url} alt={`Existing attachment ${index + 1}`} fill sizes="200px" className="object-cover rounded-lg" /></div>))}</div>)}<div className="grid grid-cols-4 gap-2">{photos.map((photo, index) => (<div key={index} className="relative group aspect-square"><Image src={URL.createObjectURL(photo)} alt={`New attachment ${index}`} fill sizes="200px" className="object-cover rounded-lg" /><Button variant="destructive" size="icon" className="absolute top-1 right-1 h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => handleRemovePhoto(index)}><X className="w-3 h-3"/></Button></div>))}</div><Button asChild variant="outline" className="w-full h-12 rounded-xl border-dashed border-2 bg-muted/30 hover:bg-muted/50 cursor-pointer"><label htmlFor="photo-upload"><UploadCloud className="w-4 h-4 mr-2" /> Upload Images<input id="photo-upload" type="file" className="sr-only" multiple accept="image/*" onChange={handlePhotoSelect} /></label></Button></div>

            <div className="space-y-1.5"><Label className="text-[10px] font-black uppercase text-muted-foreground ml-1">Status</Label><Select value={editingTask?.progressState} onValueChange={(v) => setEditingTask({ ...editingTask, progressState: v as WorkspaceTask['progressState'] })}><SelectTrigger className="h-11 rounded-xl bg-muted/30 border-none"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="todo">To-do</SelectItem><SelectItem value="doing">Doing</SelectItem><SelectItem value="completed">Completed</SelectItem><SelectItem value="verified">Verified</SelectItem><SelectItem value="accepted">Accepted</SelectItem></SelectContent></Select></div>
            
            <div className="col-span-2 grid grid-cols-3 gap-4"><div className="space-y-1.5"><Label htmlFor="task-quantity" className="text-[10px] font-black uppercase text-muted-foreground ml-1">Quantity (Qty)</Label><Input id="task-quantity" type="number" value={editingTask?.quantity || 0} onChange={(e) => setEditingTask({ ...editingTask, quantity: Number(e.target.value) })} className="h-11 rounded-xl bg-muted/30 border-none" /></div><div className="space-y-1.5"><Label htmlFor="task-unitprice" className="text-[10px] font-black uppercase text-muted-foreground ml-1">Unit Price</Label><Input id="task-unitprice" type="number" value={editingTask?.unitPrice || 0} onChange={(e) => setEditingTask({ ...editingTask, unitPrice: Number(e.target.value) })} className="h-11 rounded-xl bg-muted/30 border-none" /></div><div className="space-y-1.5"><Label htmlFor="task-discount" className="text-[10px] font-black uppercase text-muted-foreground ml-1">Discount</Label><Input id="task-discount" type="number" value={editingTask?.discount || 0} onChange={(e) => setEditingTask({ ...editingTask, discount: Number(e.target.value) })} className="h-11 rounded-xl bg-muted/30 border-none" /></div></div>
            <div className="col-span-2 p-6 bg-primary/5 rounded-3xl flex justify-between items-center border border-primary/10"><div className="space-y-1"><p className="text-[10px] font-black uppercase tracking-widest text-primary">Subtotal</p></div><span className="text-2xl font-mono font-black text-primary">${((editingTask?.quantity || 0) * (editingTask?.unitPrice || 0) - (editingTask?.discount || 0)).toLocaleString()}</span></div>
          </div>
          <DialogFooter className="p-6 bg-muted/30 border-t"><Button variant="ghost" onClick={() => { setIsAddOpen(false); setEditingTask(null); }} className="rounded-xl font-black uppercase text-[10px]">Cancel</Button><Button onClick={handleSaveTask} disabled={isUploading} className="rounded-xl px-8 shadow-xl shadow-primary/20 font-black uppercase text-[10px]">{isUploading ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Uploading & Syncing...</> : "Sync to Cloud Sovereignty"}</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
