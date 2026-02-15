
'use client';

import {
  Plus,
  ChevronRight,
  ChevronDown,
  Settings2,
  Trash2,
  CalendarPlus,
  ClipboardCheck,
  Send,
  MapPin,
} from 'lucide-react';
import Image from "next/image";

import { Badge } from '@/app/_components/ui/badge';
import { Button } from '@/app/_components/ui/button';
import { Progress } from '@/app/_components/ui/progress';
import { cn } from "@/lib/utils";

import type { TaskWithChildren } from '../_types/types';

interface TaskItemProps {
    node: TaskWithChildren;
    level?: number;
    expandedIds: Set<string>;
    visibleColumns: Set<string>;
    toggleExpand: (taskId: string) => void;
    onAddSubtask: (parentId: string) => void;
    onEdit: (task: TaskWithChildren) => void;
    onDelete: (task: TaskWithChildren) => void;
    onReportProgress: (task: TaskWithChildren) => void;
    onSubmitForQA: (task: TaskWithChildren) => void;
    onScheduleRequest: (task: TaskWithChildren) => void;
    onPreviewImage: (url: string) => void;
}

export function TaskItem({
    node,
    level = 0,
    expandedIds,
    visibleColumns,
    toggleExpand,
    onAddSubtask,
    onEdit,
    onDelete,
    onReportProgress,
    onSubmitForQA,
    onScheduleRequest,
    onPreviewImage
}: TaskItemProps) {
    const isExpanded = expandedIds.has(node.id);
    const hasChildren = node.children.length > 0;
    const isViolating = node.descendantSum > node.subtotal;

    return (
      <div className="animate-in slide-in-from-left-2 duration-300">
        <div
          className={cn(
            'group flex items-center gap-3 p-3 rounded-2xl border transition-all mb-1',
            isViolating
              ? 'bg-destructive/5 border-destructive/30'
              : 'bg-card/40 border-border/60 hover:border-primary/40',
            level > 0 &&
              'ml-8 relative before:absolute before:left-[-20px] before:top-[-10px] before:bottom-[50%] before:w-[1.5px] before:bg-primary/20 after:absolute after:left-[-20px] after:top-[50%] after:w-[15px] after:h-[1.5px] after:bg-primary/20'
          )}
        >
          <button
            onClick={() => toggleExpand(node.id)}
            className={cn(
              'p-1 hover:bg-primary/10 rounded-lg transition-colors',
              !hasChildren && 'opacity-0 pointer-events-none'
            )}
          >
            {isExpanded ? (
              <ChevronDown className="w-3.5 h-3.5 text-primary" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5 text-primary" />
            )}
          </button>

          <div className="flex-1 grid grid-cols-12 gap-3 items-center">
            <div className="col-span-4 flex items-center gap-2">
              <span className="text-[9px] font-mono font-black bg-primary/10 px-1.5 py-0.5 rounded text-primary">
                {node.wbsNo}
              </span>
              <div className="flex flex-col flex-1 truncate">
                <p className="text-xs font-black tracking-tight truncate">
                  {node.name}
                </p>
                {node.location?.description && (
                  <div className="flex items-center gap-1.5 mt-1 text-muted-foreground">
                      <MapPin className="w-3 h-3" />
                      <p className="text-[10px] font-medium truncate">{[node.location.building, node.location.floor, node.location.room, node.location.description].filter(Boolean).join(' - ')}</p>
                  </div>
                )}
                 {node.photoURLs && node.photoURLs.length > 0 && (
                  <div className="flex items-center gap-2 mt-1.5">
                    {node.photoURLs.map((url, i) => (
                       <button key={i} onClick={() => onPreviewImage(url)} className="relative w-8 h-8 rounded border overflow-hidden hover:opacity-80 transition-opacity">
                         <Image src={url} alt={`Task attachment ${i + 1}`} fill sizes="32px" className="object-cover" />
                       </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="col-span-8 grid grid-cols-6 gap-2 items-center">
              {visibleColumns.has('type') && (
                <div className="text-[9px] font-bold uppercase text-muted-foreground truncate">
                  {node.type}
                </div>
              )}
              {visibleColumns.has('priority') && (
                <Badge
                  variant="outline"
                  className={cn(
                    'text-[7px] h-4 px-1 uppercase w-fit',
                    node.priority === 'high'
                      ? 'border-red-500/50 text-red-500'
                      : ''
                  )}
                >
                  {node.priority}
                </Badge>
              )}
              {visibleColumns.has('discount') && (
                <div className="text-right">
                    <p className="text-[8px] font-black text-muted-foreground uppercase leading-none">
                        Discount
                    </p>
                    <p className="text-[10px] font-bold text-destructive">
                        -${(node.discount || 0).toLocaleString()}
                    </p>
                </div>
              )}
              {visibleColumns.has('subtotal') && (
                <div className="text-right">
                  <p className="text-[8px] font-black text-muted-foreground uppercase leading-none">
                    Budget
                  </p>
                  <p
                    className={cn(
                      'text-[10px] font-bold',
                      isViolating ? 'text-destructive' : 'text-primary'
                    )}
                  >
                    ${node.subtotal?.toLocaleString()}
                  </p>
                </div>
              )}
              {visibleColumns.has('progress') && (
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <Progress value={node.progress || 0} className="h-1 flex-1" />
                    <span className="text-[8px] font-black">
                      {node.progress || 0}%
                    </span>
                  </div>
                  {(node.quantity ?? 1) > 1 && (
                    <span className="text-[9px] text-muted-foreground font-mono font-bold text-right">
                      {node.completedQuantity || 0} / {node.quantity}
                    </span>
                  )}
                </div>
              )}
              {visibleColumns.has('status') && (
                <div className="flex justify-end items-center">
                  {node.progress === 100 && ['todo', 'doing'].includes(node.progressState) ? (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-lg text-blue-500 hover:bg-blue-500/10 hover:text-blue-500"
                      onClick={() => onSubmitForQA(node)}
                      title="Submit for QA"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  ) : (
                    <div
                      className={cn(
                        'w-2 h-2 rounded-full self-center',
                        node.progressState === 'completed'
                          ? 'bg-blue-500'
                          : node.progressState === 'verified'
                          ? 'bg-purple-500'
                          : node.progressState === 'accepted'
                          ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]'
                          : 'bg-amber-500'
                      )}
                    />
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all ml-2">
             {(node.quantity ?? 1) > 1 && !hasChildren && (
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 rounded-lg text-primary"
                onClick={() => onReportProgress(node)}
              >
                <ClipboardCheck className="w-3.5 h-3.5" />
              </Button>
            )}
             <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 rounded-lg text-primary"
                onClick={() => onScheduleRequest(node)}
            >
                <CalendarPlus className="w-3.5 h-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 rounded-lg text-primary"
              onClick={() => onAddSubtask(node.id)}
            >
              <Plus className="w-3.5 h-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 rounded-lg text-primary"
              onClick={() => onEdit(node)}
            >
              <Settings2 className="w-3.5 h-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 rounded-lg text-destructive"
              onClick={() => onDelete(node)}
            >
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>

        {isExpanded && hasChildren && (
          <div className="space-y-0.5">
            {node.children.map((child: TaskWithChildren) => (
              <TaskItem 
                key={child.id} 
                node={child} 
                level={level + 1}
                expandedIds={expandedIds}
                visibleColumns={visibleColumns}
                toggleExpand={toggleExpand}
                onAddSubtask={onAddSubtask}
                onEdit={onEdit}
                onDelete={onDelete}
                onReportProgress={onReportProgress}
                onSubmitForQA={onSubmitForQA}
                onScheduleRequest={onScheduleRequest}
                onPreviewImage={onPreviewImage}
              />
            ))}
          </div>
        )}
      </div>
    );
}
