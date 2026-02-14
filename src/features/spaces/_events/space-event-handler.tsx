// [職責] 監聽事件並執行副作用 (The Orchestrator)
"use client";
import { useEffect } from "react";
import { useApp } from "@/hooks/state/use-app";
import { toast } from "@/hooks/ui/use-toast";
import { ToastAction } from "@/app/_components/ui/toast";
import { collection, doc, writeBatch, serverTimestamp, addDoc } from 'firebase/firestore';
import type { SpaceEventPayloadMap } from "./space-events";
import { SpaceTask } from "@/types/domain";
import { useSpace } from "@/features/spaces/_hooks/use-space";
import { addDocument } from "@/infra/firebase/firestore/firestore.write.adapter";

/**
 * @fileoverview Global event handler for space-level events.
 *
 * ARCHITECTURAL ROLE: Cross-Capability Orchestration
 * This component acts as a central Observer that subscribes to multiple space events.
 * It coordinates system-wide reactions without coupling capabilities to each other.
 */
export function SpaceEventHandler() {
  const { eventBus, db, state: { space }, logAuditEvent, actions } = useSpace();
  const { dispatch } = useApp();

  useEffect(() => {
    const pushNotification = (
      title: string,
      message: string,
      type: "info" | "success" | "alert"
    ) => {
      dispatch({
        type: "ADD_NOTIFICATION",
        payload: { title, message, type },
      });
    };

    const unsubQAApproved = eventBus.subscribe(
      "space:qa:approved",
      (payload) => {
        pushNotification(
          "QA Approved",
          `Task "${payload.task.name}" is now ready for final acceptance.`,
          "info"
        );
      }
    );

    const unsubAcceptancePassed = eventBus.subscribe(
      "space:acceptance:passed",
      (payload) => {
        pushNotification(
          "Task Accepted",
          `Task "${payload.task.name}" is now ready for financial settlement.`,
          "success"
        );
      }
    );

    const unsubQARejected = eventBus.subscribe(
      "space:qa:rejected",
      async (payload) => {
        if (!db) return;
        await actions.createIssue(
          `QA Rejected: ${payload.task.name}`,
          "technical",
          "high"
        );
        pushNotification(
          "QA Rejected & Issue Logged",
          `Task "${payload.task.name}" was sent back. An issue has been automatically created.`,
          "alert"
        );
      }
    );

    const unsubAcceptanceFailed = eventBus.subscribe(
      "space:acceptance:failed",
      async (payload) => {
         if (!db) return;
        await actions.createIssue(
          `Acceptance Failed: ${payload.task.name}`,
          "technical",
          "high"
        );
        pushNotification(
          "Acceptance Failed & Issue Logged",
          `Task "${payload.task.name}" was sent back. An issue has been automatically created.`,
          "alert"
        );
      }
    );

    const handleImport = (
      payload: SpaceEventPayloadMap["space:document-parser:itemsExtracted"]
    ) => {
      const importItems = () => {
        if (!db) return;
        toast({
          title: "Importing items...",
          description: "Please wait a moment.",
        });

        const batch = writeBatch(db);
        payload.items.forEach((item) => {
          const docRef = doc(
            collection(db, "spaces", space.id, "tasks")
          );
          const taskData: Omit<SpaceTask, "id"> = {
            name: item.name,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            discount: item.discount,
            subtotal: item.subtotal,
            progress: 0,
            type: "Imported",
            priority: "medium",
            progressState: "todo",
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          };
          batch.set(docRef, taskData);
        });

        batch
          .commit()
          .then(() => {
            toast({
              title: "Import Successful",
              description: `${payload.items.length} tasks have been added.`,
            });
            logAuditEvent(
              "Imported Tasks",
              `Imported ${payload.items.length} items from ${payload.sourceDocument}`,
              "create"
            );
          })
          .catch((error: unknown) => {
            const message =
              error instanceof Error ? error.message : "Import failed";
            toast({
              variant: "destructive",
              title: "Import Failed",
              description: message,
            });
          });
      };

      toast({
        title: `Found ${payload.items.length} items from "${payload.sourceDocument}".`,
        description: "Do you want to import them as new root tasks?",
        duration: 10000,
        action: (
          <ToastAction altText="Import" onClick={importItems}>
            Import
          </ToastAction>
        ),
      });
    };

    const unsubDocParse = eventBus.subscribe(
      "space:document-parser:itemsExtracted",
      handleImport
    );
    
    const unsubScheduleRequest = eventBus.subscribe(
        'space:tasks:scheduleRequested',
        (payload) => {
            dispatch({
                type: 'REQUEST_SCHEDULE_TASK',
                payload: {
                    taskName: payload.taskName,
                    spaceId: space.id,
                }
            });
        }
    );
    
    const unsubTaskCompleted = eventBus.subscribe(
      'space:tasks:completed',
      async (payload) => {
        if (!db || !space.dimensionId) return;
        try {
          const scheduleData = {
            accountId: space.dimensionId,
            spaceId: space.id,
            spaceName: space.name,
            title: `Review: ${payload.task.name}`,
            startDate: serverTimestamp(), 
            endDate: serverTimestamp(),
            status: 'PROPOSAL', 
            originType: 'TASK_AUTOMATION',
            originTaskId: payload.task.id,
            assigneeIds: [],
            createdAt: serverTimestamp(),
          };
          await addDocument(`organizations/${space.dimensionId}/schedule_items`, scheduleData);
          
          toast({ 
            title: "Schedule Request Created", 
            description: `A proposal for "${payload.task.name}" has been sent to the organization for approval.`
          });
          logAuditEvent("Auto-Generated Schedule Proposal", `From task: ${payload.task.name}`, "create");
        } catch (error) {
           console.error("Failed to create schedule proposal:", error);
           toast({
             variant: "destructive",
             title: "Proposal Creation Failed",
             description: error instanceof Error ? error.message : "An unknown error occurred.",
           });
        }
      }
    );

    const unsubForwardRequested = eventBus.subscribe(
      'daily:log:forwardRequested',
      (payload) => {
        // For now, just show a toast to confirm the event was caught.
        // In a real implementation, this would trigger a dialog or another action.
        toast({
          title: "Forward Action Triggered",
          description: `Received request to forward log to the '${payload.targetCapability}' capability.`,
        });
      }
    );


    return () => {
      unsubQAApproved();
      unsubAcceptancePassed();
      unsubQARejected();
      unsubAcceptanceFailed();
      unsubDocParse();
      unsubScheduleRequest();
      unsubTaskCompleted();
      unsubForwardRequested();
    };
  }, [eventBus, dispatch, db, space.id, space.dimensionId, space.name, logAuditEvent, actions]);

  return null;
}
