# Architecture: Capability Pattern

## 1. Core Principle: Absolute Encapsulation

Each subdirectory in this `capabilities` folder represents a **completely self-contained, independent feature module** (a "Capability"). Examples include `tasks`, `files`, `schedule`, `qa`.

**The Golden Rule**: A Capability MUST NEVER directly import code from another Capability.

-   ❌ **INCORRECT**: `import { TaskCard } from '../tasks/_components/task-card';`
-   ✅ **CORRECT**: All communication between capabilities MUST happen asynchronously via the `WorkspaceEventBus` provided by the `useWorkspace()` hook.

## 2. Responsibility of a Capability

A Capability is responsible for its own:

-   **UI**: All components are private, located in its `_components` or `_features` subdirectories.
-   **State**: All state is managed internally, either via local state (`useState`) or dedicated hooks (`use-tasks-store.ts`). It consumes the `workspaceId` from the `useWorkspace()` context but never manages the workspace object itself.
-   **Data Access**: All data fetching and mutations are handled via its own private hooks or actions, which in turn call the `infra` layer.
-   **Entry Point**: Each capability MUST have a single public entry point file, `entry.tsx`, which is registered in `registry.ts`. This file acts as an adapter, connecting the capability to the workspace context.

## 3. Naming Conventions

-   **Capability Directory**: `kebab-case` (e.g., `document-parser`).
-   **Internal Files**: All internal files and subdirectories MUST also use `kebab-case`.

## 4. Communication Protocol: Event Bus

To communicate with other parts of the system, a Capability MUST use the event bus.

**Example Flow:**
1.  The `tasks` capability completes a task.
2.  It calls `eventBus.publish('workspace:tasks:completed', { task })`.
3.  The `qa` capability, in its `entry.tsx` or a dedicated hook, subscribes to this event: `eventBus.subscribe('workspace:tasks:completed', (payload) => { ... })`.
4.  The `qa` capability then adds the task to its own internal state (its "To-Do" list).

This ensures that `tasks` and `qa` remain completely decoupled.
