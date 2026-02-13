# 事件定義 (Events)

本文件作為系統中透過「事件總線 (Event Bus)」傳遞的主要事件的參考。它不是一個詳盡的列表，最終的真相來源 (Single Source of Truth) 始終是程式碼本身。

**程式碼位置**: `src/features/workspaces/_events/workspace-events.ts`

## 核心原則

所有跨「能力 (Capability)」的通訊都必須透過事件總線以非同步方式進行，以確保模組之間的低耦合。

## 主要事件範例

以下是一些關鍵的業務流程事件，用於說明事件驅動的交互模式：

*   **`workspace:tasks:completed`**
    *   **觸發時機**: 當一個任務的進度達到 100% 並被使用者提交時。
    *   **發布者**: `Tasks` 能力。
    *   **訂閱者 (範例)**: `QA` 能力 (將任務加入待審核佇列)。
    *   **Payload**: `{ task: WorkspaceTask }`

*   **`workspace:qa:approved`**
    *   **觸發時機**: 當 QA 人員批准一個已完成的任務時。
    *   **發布者**: `QA` 能力。
    *   **訂閱者 (範例)**: `Acceptance` 能力 (將任務加入待驗收佇列)。
    *   **Payload**: `{ task: WorkspaceTask, approvedBy: string }`

*   **`workspace:qa:rejected`**
    *   **觸發時機**: 當 QA 人員拒絕一個已完成的任務時。
    *   **發布者**: `QA` 能力。
    *   **訂閱者 (範例)**: `Issues` 能力 (自動創建一個高優先級的技術問題單)。
    *   **Payload**: `{ task: WorkspaceTask, rejectedBy: string }`

*   **`workspace:acceptance:passed`**
    *   **觸發時機**: 當最終使用者或客戶驗收通過一個任務時。
    *   **發布者**: `Acceptance` 能力。
    *   **訂閱者 (範例)**: `Finance` 能力 (將任務加入待支付清單)。
    *   **Payload**: `{ task: WorkspaceTask, acceptedBy: string }`

*   **`workspace:document-parser:itemsExtracted`**
    *   **觸發時機**: 當 `Document Parser` 能力成功從上傳的文檔（如發票）中提取出工作項目時。
    *   **發布者**: `Document Parser` 能力。
    *   **訂閱者 (範例)**: 全局的 `WorkspaceEventHandler` (彈出一個 Toast 通知，詢問使用者是否要將這些項目導入為新的任務)。
    *   **Payload**: `{ sourceDocument: string, items: Array<ParsedItem> }`

---

**注意**: 完整的事件列表、名稱和 payload 結構，請務必參考 `workspace-events.ts` 檔案。
