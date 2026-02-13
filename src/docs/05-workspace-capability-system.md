
# 5. 工作區與能力系統 (Workspace & Capability System)

此圖詳細拆解了 `WorkspaceLayout` 如何根據 URL 參數動態渲染不同的「能力」，並展示了「一個核心，兩種視圖」的設計模式。

```mermaid
graph TD
    subgraph "入口 (Routing)"
        A[URL: /workspaces/[id]?capability=tasks]
    end

    subgraph "外殼 (Shell)"
        B[WorkspaceLayout] -- "提供 WorkspaceContext" --> C[WorkspaceCapabilityRenderer]
    end

    subgraph "能力註冊表 (Registry)"
        D[CAPABILITIES Registry]
    end

    subgraph "動態載入的能力 (Dynamic Import)"
        E["features/.../tasks/entry.tsx"]
        F["features/.../files/entry.tsx"]
        G["features/.../settings/entry.tsx"]
    end
    
    subgraph "『一個核心，兩種視圖』模式"
        H1[OrganizationAuditPage] -- "傳入 aggregated data" --> V[AuditView]
        H2[WorkspaceAuditPage] -- "傳入 filtered data" --> V
    end

    A -- "讀取 capability 參數" --> C
    C -- "從註冊表查找元件" --> D
    C -- "動態載入" --> E

    style B fill:#fff0f5,stroke:#db2777
    style V fill:#f0f9ff,stroke:#0ea5e9
```
