
# Architecture: Global Layout Feature

## 1. Core Principles & Responsibilities

This AI's primary directive is to assist with development by **proactively using the available tools** to understand the application's real-time state before making changes.

- **Tool-First Approach**: Before any code modification, I will use `nextjs_index` and `nextjs_call` to query the running application's routes, component structure, and error states.
- **Documentation-Driven**: I will use `nextjs_docs` to get accurate API information. I will not rely on prior knowledge.
- **Efficiency**: I will leverage code generation tools (`shadcn`) and project analysis tools (`repomix`) where appropriate to ensure efficient and accurate task completion.

The `layout` feature slice is responsible for the application's main shell, which is rendered via Next.js Parallel Routes. This includes:

-   The primary Sidebar navigation (`@sidebar`).
-   The global Header (`@header`).
-   The account switcher logic and UI.
-   The main navigation structure (main menu and space quick links).
-   The user profile menu and logout functionality.

This feature provides the persistent frame within which all other page content is rendered.

## 2. Architectural Pattern: "One Core, Two Views"

A key design principle in this application is the use of polymorphic view components. This pattern avoids code duplication when a feature needs to be presented in different contexts (e.g., at a single space level vs. an aggregated organization level).

- **Example**: `AuditView` or `UnifiedScheduleView`.
- **Mechanism**: The view component is "dumb" and only responsible for rendering the data it receives.
- **Implementation**:
    - An **organizational** container (e.g., `OrganizationAuditPage`) fetches **aggregated data** from a global context (`useAccount`) and passes it to the view.
    - A **space-specific** container (e.g., `SpaceAuditPage`) fetches **filtered, local data** from its context (`useSpace`) and passes it to the *same* view.

This ensures maximum code reuse and separation of concerns.

## 3. Boundary Rules

-   **Stateless Navigation**: The components in this slice are responsible for rendering navigation links, but they MUST NOT contain the page content itself. All page content is rendered via the `@main` parallel route slot.
-   **Global State Only**: This feature should only interact with global application state (e.g., `useApp`, `useAuth`). It MUST NOT fetch or manage data specific to a single space or page.
-   **No Page-Specific Logic**: Logic specific to a particular page or feature (e.g., the "Create Task" button for the Tasks capability) does not belong here. It belongs within the respective feature slice.
-   **Private Components (`_components`)**: All components are considered private to the layout feature and MUST NOT be imported by other features.

## 4. Naming Conventions

-   All files and directories MUST use `kebab-case`.
    -   **Correct**: `account-switcher.tsx`, `nav-main.tsx`
    -   **Incorrect**: `AccountSwitcher.tsx`, `NavMain.tsx`
