'use client';

import { useActionState, useTransition, useRef, useEffect } from 'react';

import { Loader2, UploadCloud, File } from 'lucide-react';

import type { WorkItem } from '@/ai/schemas/docu-parse';
import { Button } from '@/app/_components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/app/_components/ui/card';
import { useSpace } from '@/features/spaces';
import { useToast } from '@/hooks/ui/use-toast';

import {
  extractDataFromDocument,
  type ActionState,
} from './_actions/actions';


const initialState: ActionState = {
  data: undefined,
  error: undefined,
  fileName: undefined,
};

function WorkItemsTable({
  initialData,
  onImport,
}: {
  initialData: WorkItem[];
  onImport: () => void;
}) {
  return (
    <div>
      <div className="overflow-x-auto rounded-md border">
         <pre className="p-4 bg-muted/50 rounded-lg text-xs">{JSON.stringify(initialData, null, 2)}</pre>
      </div>

      <div className="flex justify-end items-center mt-6">
        <Button onClick={onImport}>Import as Root Tasks</Button>
      </div>
    </div>
  );
}


export default function SpaceDocumentParser() {
  const [state, formAction] = useActionState(
    extractDataFromDocument,
    initialState
  );
  const { eventBus, logAuditEvent } = useSpace() as any;
  const [isPending, startTransition] = useTransition();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (state.error) {
      toast({
        variant: 'destructive',
        title: 'Extraction Failed',
        description: state.error,
      });
    }
  }, [state.error, toast]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      if (formRef.current) {
        const formData = new FormData(formRef.current);
        startTransition(() => {
          formAction(formData);
        });
      }
    }
  };

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    fileInputRef.current?.click();
  };

  const handleImport = () => {
    if (!state.data?.workItems) return;
    
    eventBus.publish('space:document-parser:itemsExtracted', {
        sourceDocument: state.fileName || 'Unknown Document',
        items: state.data.workItems.map(item => ({
            name: item.item,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            discount: item.discount,
            subtotal: item.price,
        })),
    });

    logAuditEvent('Triggered Task Import', `From document: ${state.fileName}`, 'create');

  }

  return (
    <div className="space-y-6">
      <Card className="w-full shadow-lg bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Document Upload</CardTitle>
          <CardDescription>
            Select a document to begin AI data extraction.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form ref={formRef}>
            <div
              className="relative flex flex-col items-center justify-center w-full p-8 border-2 border-dashed rounded-lg cursor-pointer border-border hover:border-primary transition-colors"
              onClick={handleUploadClick}
              onKeyDown={(e) => e.key === 'Enter' && handleUploadClick()}
              role="button"
              tabIndex={0}
              aria-label="Upload document"
            >
              <UploadCloud className="w-12 h-12 text-muted-foreground" />
              <p className="mt-4 text-sm text-muted-foreground">
                <span className="font-semibold text-primary">
                  Click to upload
                </span>{' '}
                or drag and drop
              </p>
              <p className="text-xs text-muted-foreground">
                Supported formats: PDF, PNG, JPG
              </p>
              <input
                ref={fileInputRef}
                type="file"
                name="file"
                className="hidden"
                onChange={handleFileChange}
                disabled={isPending}
                accept=".pdf,.png,.jpg,.jpeg"
              />
            </div>
          </form>
        </CardContent>
      </Card>

       {isPending && (
        <div className="flex flex-col items-center justify-center mt-8 text-center">
          <Loader2 className="w-16 h-16 animate-spin text-primary mb-4" />
          <p className="text-lg font-medium text-foreground">Extracting Data...</p>
          <p className="text-muted-foreground">This may take a moment.</p>
        </div>
      )}

      {state.data && !isPending && (
        <div className="mt-8">
            <Card className="shadow-2xl bg-card">
                <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                    <CardTitle className="text-2xl">Extracted Items</CardTitle>
                    <CardDescription className="flex items-center gap-2 pt-2">
                        <File className="w-4 h-4" />
                        {state.fileName}
                    </CardDescription>
                    </div>
                </div>
                </CardHeader>
                <CardContent>
                    <WorkItemsTable initialData={state.data.workItems} onImport={handleImport} />
                </CardContent>
            </Card>
        </div>
      )}
    </div>
  );
}
