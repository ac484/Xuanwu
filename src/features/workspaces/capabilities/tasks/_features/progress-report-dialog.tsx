'use client';

import { useState, useEffect } from "react";
import { toast } from "@/hooks/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/app/_components/ui/dialog';
import { Button } from '@/app/_components/ui/button';
import { Label } from '@/app/_components/ui/label';
import { Input } from '@/app/_components/ui/input';
import type { TaskWithChildren } from '../_types/types';

export function ProgressReportDialog({
  task,
  isOpen,
  onClose,
  onSubmit,
}: {
  task: TaskWithChildren | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (taskId: string, newCompletedQuantity: number) => Promise<void>;
}) {
  const [submissionQuantity, setSubmissionQuantity] = useState<number | string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSubmissionQuantity('');
      setIsSubmitting(false);
    }
  }, [isOpen]);

  if (!task) return null;

  const currentCompleted = task.completedQuantity || 0;
  const totalQuantity = task.quantity || 1;

  const handleSubmit = async () => {
    const submitted = Number(submissionQuantity);
    if (isNaN(submitted) || submitted <= 0) {
      toast({ variant: 'destructive', title: 'Invalid quantity' });
      return;
    }

    const newTotal = currentCompleted + submitted;
    if (newTotal > totalQuantity) {
      toast({ variant: 'destructive', title: 'Quantity exceeds total' });
      return;
    }

    setIsSubmitting(true);
    await onSubmit(task.id, newTotal);
    setIsSubmitting(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Report Progress</DialogTitle>
          <DialogDescription>
            Submit completed quantity for "{task.name}". Current: {currentCompleted} / {totalQuantity}
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <Label htmlFor="submission-quantity">Quantity for this submission</Label>
          <Input
            id="submission-quantity"
            type="number"
            value={submissionQuantity}
            onChange={(e) => setSubmissionQuantity(e.target.value)}
            placeholder={`e.g., 15 (max: ${totalQuantity - currentCompleted})`}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit Progress'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
