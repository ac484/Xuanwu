# 術語詞彙表 (Glossary)

本文件定義了專案架構中的核心術語，以確保團隊成員有統一的理解和溝通語言。

### **功能切片 (Feature Slice)**

*   **定義**: 一個位於 `src/features/` 下的、高內聚的、職責單一的目錄。它是我們架構的基本模組單元。
*   **範例**: `core`, `layout`, `workspaces`。

### **核心功能切片 (Core Feature Slice)**

*   **定義**: 位於 `src/features/core/`，負責管理整個應用程式的**身份與上下文**。
*   **包含**:
    *   **`auth`**: 用戶身份驗證與會話。
    *   **`account`**: 帳戶/組織的上下文切換與管理。
*   **職責**: 提供渲染應用內容所需的身份和上下文環境。

### **佈局切片 (Layout Feature Slice)**

*   **定義**: 位於 `src/features/layout/`，負責渲染應用的**全局介面外殼**。
*   **職責**: 實現 `Sidebar` 和 `Header` 等持續存在的 UI 框架。

### **工作區切片 (Workspace Feature Slice)**

*   **定義**: 位於 `src/features/workspaces/`，負責所有與「工作區」這一核心業務對象相關的邏輯。
*   **職責**:
    1.  管理工作區的列表、創建、刪除等操作 (`WorkspacesPage`)。
    2.  作為單一工作區的「容器 (Shell)」，提供 `WorkspaceContext` (`WorkspaceLayout`)。
    3.  定義和註冊所有可用的「能力 (Capabilities)」。

### **能力 (Capability)**

*   **定義**: 一個位於 `src/features/workspaces/capabilities/` 下的、完全自包含的功能模組，用於實現一項具體的治理或業務目標。
*   **原則**: 每個能力都遵循絕對的封裝原則，禁止跨能力直接導入。所有跨能力通訊必須透過事件總線。
*   **範例**: `Tasks`, `Audit`, `Schedule`。

### **治理控制平面 (Control Plane)**

*   **定義**: 一組用於「管理和監控」工作區的「能力」集合。它們是關於「工作的工作 (Work about the work)」。
*   **範例**: `Settings`, `Members` (成員管理), `Audit` (審計日誌), `QA` (品質保證)。

### **業務能力平面 (Runtime Plane)**

*   **定義**: 一組用於「執行具體業務價值」的「能力」集合。它們是終端使用者的生產力工具。
*   **範例**: `Tasks` (任務), `Files` (文件), `Finance` (財務)。

### **基礎設施層 (Infrastructure Layer)**

*   **定義**: 在我們的架構中，特指負責解耦通訊的機制，其核心是**事件總線 (Event Bus)**。
*   **職責**: 作為「治理控制平面」和「業務能力平面」之間唯一的通訊渠道。它允許一個能力對另一個能力的活動做出反應，而兩者之間沒有任何直接的程式碼依賴。

### **能力註冊表 (Capability Registry)**

*   **定義**: 位於 `src/features/workspaces/` 下的一組 `*.registry.ts` 檔案。
*   **職責**: 作為系統中所有「能力」的唯一真相來源 (Single Source of Truth)。它定義了每個能力的存在、標籤、圖標和對應的元件入口，並區分了不同的類型（如 `shell`, `governance`, `business`）。
