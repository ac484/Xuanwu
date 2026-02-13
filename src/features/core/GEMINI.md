# Architecture: Core Feature Slice

## 1. Responsibility

The `core` feature slice is responsible for the application's **identity and context**. It is a macro-feature that encapsulates all functionality required to know *who* the user is and *what dimension* they are operating in.

It is comprised of two primary sub-features:

1.  **`auth`**: Manages user identity, session state, and all related authentication UI (login, register).
2.  **`account`**: Manages the user's profile, organization data, and the concept of the `activeAccount` (the current dimension or context the user is operating in).

## 2. Boundary Rules

-   **Unidirectional Dependency**: The `core` slice is allowed to depend on the `workspaces` slice. Specifically, its `account` logic needs to read the `Capability Registry` from `workspaces` to build navigation menus for different contexts.
-   **Strict Isolation**: The `workspaces` and `layout` feature slices MUST NOT import anything from the `core` slice. `core` sits above them in the dependency chain.

## 3. Naming Conventions

-   All files and directories MUST use `kebab-case`.
-   All internal implementation details MUST be placed in `_` prefixed folders.
