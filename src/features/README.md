# 🚀 Project Development Guidelines: Function Modularization Guide (v2.0)

## I. Core Architectural Philosophy

To maintain a clean and scalable architecture, we separate **business logic** into self-contained **Feature Slices**. The `app/` directory should remain as lean as possible, concerned only with routing and layout composition.

- **`app/`**: Responsible for "route distribution" and "layout structure" (parallel routes). It should not contain business logic.
- **`src/features/`**: The heart of the application's business logic. It contains two primary, high-level feature slices.

---

## II. The Two Primary Feature Slices

1.  **`core/` (The Application Shell):**
    *   **Responsibility**: Manages the application's global "shell" and user context. This is a macro-feature that includes everything needed *before* displaying workspace-specific content.
    *   **Sub-features**:
        *   `auth`: User identity, session management, and login UI.
        *   `account`: User profile, organization data, and the `activeAccount` context.
        *   `layout`: The persistent global UI, such as the sidebar and header.

2.  **`workspaces/` (The Application Content):**
    *   **Responsibility**: Manages all logic related to the core business domain: "Workspaces". This includes the workspace container itself and the entire pluggable "Capability" system.
    *   **Key Principle**: This slice is entirely self-contained and **must not** depend on the `core` slice. It provides the application's primary business value.

---

## III. Feature Module Encapsulation Protocol

Within each feature slice (e.g., `core/auth`, `workspaces/capabilities/tasks`), we use an underscore `_` prefix to enforce privacy and encapsulation.

-   **Public Modules (`components/`, `hooks/`, `index.ts`)**: These are the "bosses" or public APIs of the feature. Only what is explicitly exported from the feature's `index.ts` can be consumed by other parts of the application (following boundary rules).
-   **Private Modules (`_components/`, `_hooks/`, `_actions/`)**: These are the "employees" or implementation details. They are strictly private to their parent feature and **must not** be imported from outside.

### Barrel Files (`index.ts`)

Each feature slice (e.g., `core/auth`, `workspaces`) MUST have an `index.ts` file that acts as its single, controlled export point.

-   **Rule**: Never export modules from private (`_`) folders in the `index.ts`.
-   **Example**:
    *   ✅ `import { LoginPage } from '@/features/core/auth';`
    *   ❌ `import { LoginForm } from '@/features/core/auth/_components/login-form';`

---

## IV. The Three Laws of Development

1.  **Physical distance determines dependency**: A module's location in the directory tree dictates its allowed dependencies. Higher-level features (like `core`) can depend on lower-level ones (like `workspaces`), but never the other way around.
2.  **Route interference awareness**: `_components` in `src/app/` prevents a directory from becoming a route segment. In `src/features/`, this convention is used for logical privacy, not routing.
3.  **Reject excessive nesting**: If a file path becomes too deep, it's a sign that the feature is too complex and should be decomposed into smaller, more focused sub-features.
