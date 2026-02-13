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

## 3. Communication Protocol: Event Bus

To communicate with other parts of the system, a Capability MUST use the event bus.

**Example Flow:**
1.  The `tasks` capability completes a task.
2.  It calls `eventBus.publish('workspace:tasks:completed', { task })`.
3.  The `qa` capability, in its `entry.tsx` or a dedicated hook, subscribes to this event: `eventBus.subscribe('workspace:tasks:completed', (payload) => { ... })`.
4.  The `qa` capability then adds the task to its own internal state (its "To-Do" list).

This ensures that `tasks` and `qa` remain completely decoupled.

## 4. The "One Core, Two Views" Pattern

A key architectural pattern in this project is the use of a single core view component that can be rendered in different contexts (e.g., organization-wide vs. workspace-specific).

**Pain Point Solved**: Avoids duplicating UI and logic for aggregated views (organization level) and filtered views (workspace level).

**Implementation**:
1.  A reusable, "dumb" view component is created (e.g., `AuditView`, `UnifiedScheduleView`). This component is context-agnostic and simply renders the data it receives as props.
2.  Two (or more) "smart" container components are created to provide the context:
    *   **Organization-level container** (e.g., `OrganizationAuditPage`): Uses global hooks like `useAccount()` to fetch and pass down **aggregated data** from all relevant workspaces.
    *   **Workspace-level container** (e.g., `WorkspaceAuditPage`): Uses context-specific hooks like `useWorkspace()` to pass down **filtered data** for that single workspace.

This pattern allows for maximum code reuse and a clean separation between data fetching/context and UI presentation.
