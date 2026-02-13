# Firestore 資料模型 (Schema)

本文件定義了 `Firestore` 資料庫中核心集合的數據結構。這是應用程式數據持久化的藍圖。

**最終的真相來源 (Single Source of Truth)**: `src/types/domain.ts`

---

## 核心集合 (Top-Level Collections)

### `users`
*   **路徑**: `users/{userId}`
*   **職責**: 存儲每個使用者的公開個人資料。
*   **結構 (`UserProfile`)**:
    ```typescript
    interface UserProfile {
      id: string;
      bio?: string;
      photoURL?: string;
      expertiseBadges?: ExpertiseBadge[];
    }
    ```
*   **子集合**:
    *   `bookmarks`: 存儲使用者收藏的 `dailyLogs` 的 ID。

### `organizations`
*   **路徑**: `organizations/{orgId}`
*   **職責**: 存儲組織維度的所有核心數據。
*   **結構 (`Organization`)**:
    ```typescript
    interface Organization {
      id: string;
      name: string;
      description: string;
      ownerId: string;
      members: MemberReference[]; // 包含角色的成員列表
      memberIds: string[];       // 用於安全規則查詢的純 ID 列表
      teams: Team[];           // 內部與外部團隊的定義
      createdAt: Timestamp;
    }
    ```
*   **子集合**:
    *   `dailyLogs`: 組織範圍內的每日日誌。
    *   `auditLogs`: 組織範圍內的審計日誌。
    *   `invites`: 發送給外部合作夥伴的邀請。
    *   `schedule_items`: 組織範圍內的排程項目。

### `workspaces`
*   **路徑**: `workspaces/{workspaceId}`
*   **職責**: 存儲單一工作區（邏輯空間）的元數據和配置。
*   **結構 (`Workspace`)**:
    ```typescript
    interface Workspace {
      id: string;
      dimensionId: string; // 所屬的 UserID 或 OrganizationID
      name: string;
      lifecycleState: 'preparatory' | 'active' | 'stopped';
      visibility: 'visible' | 'hidden';
      capabilities: Capability[]; // 已掛載的能力列表
      grants: WorkspaceGrant[];   // 個人權限授予列表
      teamIds: string[];          // 已授權的團隊 ID 列表
      createdAt: Timestamp;
    }
    ```
*   **子集合**:
    *   `tasks`: 工作區內的任務 (WBS)。
    *   `issues`: 工作區內的問題單。
    *   `files`: 工作區內的文件版本。

---
**注意**: 完整的 TypeScript 類型定義，請務必參考 `src/types/domain.ts` 檔案。
