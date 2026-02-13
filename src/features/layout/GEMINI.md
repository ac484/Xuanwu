# Architecture: Global Layout Feature

## 1. Responsibility

The `layout` feature slice is responsible for the application's main shell, which is rendered via Next.js Parallel Routes. This includes:

-   The primary Sidebar navigation (`@sidebar`).
-   The global Header (`@header`).
-   The account switcher logic and UI.
-   The main navigation structure (main menu and workspace quick links).
-   The user profile menu and logout functionality.

This feature provides the persistent frame within which all other page content is rendered.

## 2. Boundary Rules

-   **Stateless Navigation**: The components in this slice are responsible for rendering navigation links, but they MUST NOT contain the page content itself. All page content is rendered via the `@main` parallel route slot.
-   **Global State Only**: This feature should only interact with global application state (e.g., `useApp`, `useAuth`). It MUST NOT fetch or manage data specific to a single workspace or page.
-   **No Page-Specific Logic**: Logic specific to a particular page or feature (e.g., the "Create Task" button for the Tasks capability) does not belong here. It belongs within the respective feature slice.
-   **Private Components (`_components`)**: All components are considered private to the layout feature and MUST NOT be imported by other features.

## 3. Naming Conventions

-   All files and directories MUST use `kebab-case`.
    -   **Correct**: `account-switcher.tsx`, `nav-main.tsx`
    -   **Incorrect**: `AccountSwitcher.tsx`, `NavMain.tsx`
