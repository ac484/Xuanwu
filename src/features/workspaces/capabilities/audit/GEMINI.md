# Architecture: Audit Feature

## 1. Responsibility

The `audit` feature slice is responsible for displaying audit logs. This functionality is presented in two contexts:

1.  **Organization View (`/audit`)**: Shows an aggregated stream of all audit events across all workspaces within the active organization.
2.  **Workspace View (`/workspaces/[id]?capability=audit`)**: Shows a filtered stream of audit events pertaining only to that specific workspace.

## 2. Directory Structure & Naming

-   **Structure**: This directory MUST be organized by sub-feature. All assets specific to this feature are considered **private** and must be placed in underscore-prefixed folders (`_components`, `_hooks`).
-   **File Naming**: All files and sub-directories MUST use `kebab-case`.

## 3. Boundary Rules

-   **Data Source**: The `AuditView` component is context-aware. It uses `useAccount()` for the organization view and `useOptionalWorkspace()` for the workspace view to source its data.
-   **UI Components**: UI components should be either:
    1.  **Local/Private (`_components`)**: Defined within this feature's `_components` directory. They MUST NOT be imported by other features.
    2.  **Global (`src/app/_components/ui`)**: Imported from the global UI directory if they are generic, reusable primitives.
-   **No External Feature Dependencies**: This feature slice MUST NOT directly import code from other feature slices.
