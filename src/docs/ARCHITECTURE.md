# Architecture: Core Principles & Responsibilities

This AI's primary directive is to assist with development by **proactively using the available tools** to understand the application's real-time state before making changes.

- **Tool-First Approach**: Before any code modification, I will use `nextjs_index` and `nextjs_call` to query the running application's routes, component structure, and error states.
- **Documentation-Driven**: I will use `nextjs_docs` to get accurate API information. I will not rely on prior knowledge.
- **Efficiency**: I will leverage code generation tools (`shadcn`) and project analysis tools (`repomix`) where appropriate to ensure efficient and accurate task completion.

---

# OrgVerse Architecture

This document contains a series of diagrams that describe the architecture of the OrgVerse application.

---

## 1. System Architecture

This diagram provides a high-level overview of the entire system, including the frontend, backend services, and their interactions.

```mermaid
graph TD
    subgraph Frontend [Next.js on Vercel]
        A[User Browser] --> B(Next.js App);
    end

    subgraph Backend [Google Cloud / Firebase]
        C[Firebase Authentication]
        D[Cloud Firestore]
        E[Cloud Storage for Firebase]
        F[Genkit AI]
    end

    B --> C;
    B --> D;
    B --> E;
    B --> F;

    style A fill:#f9f,stroke:#333,stroke-width:2px;
    style B fill:#add,stroke:#333,stroke-width:2px;
    style C fill:#f96,stroke:#333,stroke-width:2px;
    style D fill:#f96,stroke:#333,stroke-width:2px;
    style E fill:#f96,stroke:#333,stroke-width:2px;
    style F fill:#f96,stroke:#333,stroke-width:2px;
```

---

## 2. App Shell & Parallel Routing

This diagram illustrates how Next.js Parallel Routes are used to create the main application shell.

```mermaid
graph TD
    subgraph App Router Structure
        A(app/layout.tsx) --> B(@sidebar);
        A --> C(@header);
        A --> D(@main);
        A --> E(@auth);
    end

    subgraph Feature Slices
        F[features/layout] --> B;
        F --> C;
        G[features/workspaces] --> D;
        H[features/core/auth] --> E;
    end

    style A fill:#ccf,stroke:#333,stroke-width:2px;
    style B fill:#add,stroke:#333,stroke-width:2px;
    style C fill:#add,stroke:#333,stroke-width:2px;
    style D fill:#add,stroke:#333,stroke-width:2px;
    style E fill:#add,stroke:#333,stroke-width:2px;
```

---

## 3. State Management & Data Flow

This diagram shows the hierarchy of React Context providers and how state flows through the application.

```mermaid
graph TD
    A(FirebaseClientProvider) --> B(AuthProvider);
    B --> C(AppProvider);
    C --> D(AccountProvider);
    D --> E(WorkspaceContextShell);

    subgraph "Provided State"
        B -- "user, authInitialized" --> F{UI Components};
        C -- "activeAccount, organizations" --> F;
        D -- "workspaces, dailyLogs, auditLogs" --> F;
        E -- "workspace, tasks, issues" --> F;
    end

    subgraph "Hooks"
        G(useAuth) --> F;
        H(useApp) --> F;
        I(useAccount) --> F;
        J(useWorkspace) --> F;
    end

    style A fill:#f96;
    style B fill:#f96;
    style C fill:#f96;
    style D fill:#f96;
    style E fill:#f96;
    style F fill:#ccf,stroke:#333,stroke-width:2px;
```

---

## 4. Account Governance Model

This diagram details the components that make up the account governance feature slice.

```mermaid
graph TD
    A(ActiveAccount) --> B[Members Management];
    A --> C[Internal Team Management];
    A --> D[Partner Team Management];
    A --> E[Permission Matrix];
    A --> F[Personal Settings];

    style A fill:#f9f,stroke:#333,stroke-width:2px;
    style B fill:#9cf;
    style C fill:#9cf;
    style D fill:#9cf;
    style E fill:#9cf;
    style F fill:#9cf;
```

---

## 5. Workspace & Capability System

This diagram explains the modular "Capability" system within a workspace.

```mermaid
graph TD
    A(URL Parameter: ?capability=tasks) --> B(WorkspaceCapabilityRenderer);
    B --> C{Dynamically Load Component};

    subgraph "Capability Components"
        C --> D[Tasks Capability];
        C --> E[Files Capability];
        C --> F[Settings Capability];
        C --> G[...Other Capabilities];
    end
    
    subgraph "Pattern: 'One Core, Two Views'"
        H(OrganizationAuditPage) -- "Aggregated Data" --> I(AuditView Core Component);
        J(WorkspaceAuditPage) -- "Filtered Data" --> I;
    end

    style B fill:#ccf,stroke:#333,stroke-width:2px;
    style C fill:#f9f,stroke:#333,stroke-width:2px;
    style H fill:#add;
    style J fill:#add;
    style I fill:#f96;
```

---

## 6. Event Bus Interaction

This sequence diagram illustrates how decoupled communication between capabilities is achieved using an event bus.

```mermaid
sequenceDiagram
    participant T as Tasks
    participant E as WorkspaceEventBus
    participant Q as QA
    participant I as Issues

    T->>E: publish('workspace:tasks:completed')
    E->>Q: notify(payload)
    Q->>Q: User performs QA check
    alt QA Fails
        Q->>E: publish('workspace:qa:rejected')
        E->>I: notify(payload)
        I->>I: Create new issue
    else QA Passes
        Q->>E: publish('workspace:qa:approved')
    end
```

---

## 7. Firestore Data Model

This diagram outlines the primary collections and sub-collections in the Firestore database.

```mermaid
graph TD
    subgraph Root Collections
        A(users)
        B(organizations)
        C(workspaces)
    end

    subgraph Sub-Collections
        B --> B1(dailyLogs)
        B --> B2(auditLogs)
        B --> B3(invites)
        B --> B4(schedule_items)
        
        C --> C1(tasks)
        C --> C2(issues)
        C --> C3(files)
    end
    
    style A fill:#f96;
    style B fill:#f96;
    style C fill:#f96;
```

---

## 8. Authentication Flow

This diagram shows the user authentication flow, highlighting the use of Next.js Intercepted Routes for the login modal.

```mermaid
graph TD
    subgraph "Scenario 1: Direct Navigation"
        A[User visits /login] --> B(Render /login Page);
    end

    subgraph "Scenario 2: Intercepted Route"
        C[User on / clicks 'Login'] --> D{Next.js Router};
        D -- "Intercepts navigation" --> E(Render @auth/(.)login/page.tsx);
        E --> F[Show Login Modal];
    end

    style A fill:#ccf;
    style B fill:#add;
    style C fill:#ccf;
    style D fill:#f9f;
    style E fill:#add;
    style F fill:#9cf;
```
