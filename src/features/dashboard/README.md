# Dashboard Feature Slice

## 1. Responsibility

The `dashboard` feature slice is responsible for rendering the main content of the user's dashboard after they have authenticated and selected an account context (either personal or an organization). It acts as a container and entry point for high-level views of the active account's data.

Its primary responsibility is to provide an aggregated "overview" of the most critical information from various workspace capabilities.

## 2. Key Components

-   **`overview-page.tsx`**: The main component that assembles the dashboard UI.
-   **`_components/`**: This directory contains all the "widget" or "card" components that make up the dashboard, such as:
    -   `org-grid.tsx`: Displays a grid of other organizations the user belongs to.
    -   `workspace-list.tsx`: Shows a list of recent or important workspaces for the active account.
    -   `stat-cards.tsx`: Renders key performance indicators (KPIs) for the active account.
    -   `permission-tree.tsx`: Visualizes the user's permission level within the current context.

## 3. Data Flow

1.  The `OverviewPage` component is rendered by the `app/@main/overview/page.tsx` parallel route.
2.  It uses hooks like `useApp()`, `useAuth()`, and `useAccount()` to consume the application's global state.
3.  This state is then passed down as props to the various child components (`StatCards`, `WorkspaceList`, etc.).
4.  The child components are "dumb" and are only responsible for displaying the data they receive.

## 4. Boundary Rules

-   This feature slice **consumes** data from the global context layer (`/src/context`).
-   It **does not** contain business logic for fetching or mutating data itself. All data comes from the context providers.
-   It **does not** directly depend on any other `features/*` slice. It is a consumer of global state.
