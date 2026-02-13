# Architecture: Account Feature

## 1. Responsibility

The `account` feature slice is responsible for all functionality related to user and organization governance. This is the single source of truth for:

-   User Profile Settings (`/settings`)
-   Organization Member Management (`/members`)
-   Internal Team Management (`/teams`)
-   Partner Team Management (`/partners`)
-   Permission Matrix Visualization (`/matrix`)

## 2. Directory Structure & Naming

-   **Structure**: This directory MUST be organized by sub-feature (e.g., `_components/members`, `_hooks/use-teams-logic.ts`). All assets specific to this feature are considered **private** and must be placed in underscore-prefixed folders (`_components`, `_hooks`, `_actions`).
-   **File Naming**: All files and sub-directories MUST use `kebab-case`.
    -   **Correct**: `team-card.tsx`, `use-member-invite.ts`
    -   **Incorrect**: `TeamCard.tsx`, `useMemberInvite.ts`

## 3. Boundary Rules

-   **Data Source**: All data for this feature MUST be consumed from the application's React Context (`useApp`, `useAccount`) or from dedicated hooks that access infrastructure services.
-   **UI Components**: UI components should be either:
    1.  **Local/Private (`_components`)**: Defined within this feature's `_components` directory. They MUST NOT be imported by other features.
    2.  **Global (`src/app/_components/ui`)**: Imported from the global UI directory if they are generic, reusable primitives.
-   **No External Feature Dependencies**: This feature slice MUST NOT directly import code from other feature slices like `workspaces`.
