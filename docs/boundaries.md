# 架構邊界 (Architectural Boundaries)

本文件定義了專案中模組之間嚴格的依賴規則和邊界，以確保系統的低耦合和長期可維護性。

## 1. 主要邊界：功能切片之間 (Between Feature Slices)

這是整個架構中最重要的一條規則，它定義了切片之間的單向依賴流。

**`layout` -> `core` -> `workspaces`**

*   **`layout` 可以依賴 `core`**: 佈局（如 `Sidebar`）需要知道當前用戶是誰 (`core/auth`) 以及在哪個帳戶上下文 (`core/account`)，以便渲染正確的資訊。
*   **`core` 可以依賴 `workspaces`**: 核心（如 `account` 的導航映射）需要知道有哪些 `workspaces` 能力可以被顯示在導航中，因此它可以導入 `workspaces` 導出的公開註冊表。
*   **嚴禁反向依賴**:
    *   `workspaces` **絕對不能**導入 `core` 或 `layout`。
    *   `core` **絕對不能**導入 `layout`。

**違規範例**:

*   ❌ `import ... from '@/features/core/...'` in `src/features/workspaces/`
*   ❌ `import ... from '@/features/layout/...'` in `src/features/core/`

## 2. 次要邊界：功能切片內部 (Within a Feature Slice)

為了實現內部封裝，我們使用 `_` (底線) 前綴來區分私有和公有資產。

> **一個功能切片絕對不能導入另一個功能切片中以 `_` 開頭的私有目錄下的任何模組。**

*   **私有資產 (`_components`, `_hooks`, `_actions`, `_constants`)**:
    *   **定義**: 這些是某個功能切片內部的具體實現細節。
    *   **規則**: 它們只能被其所屬的父功能切片內部的文件引用。

*   **公有接口 (`components/`, `index.ts`)**:
    *   **定義**: 每個功能切片應該有一個 `index.ts` (桶子檔案)，明確導出它希望對外暴露的、可被其他模組使用的公有接口（通常是頁面級元件）。
    *   **規則**: 任何跨切片的引用都應該透過這個公有的 `index.ts` 進行。

**範例:**

*   ❌ **錯誤**: `import { LoginForm } from '@/features/core/auth/_components/login-form';`
*   ✅ **正確**: `import { LoginPage } from '@/features/core/auth';` (假設 `LoginPage` 已在 `auth` 的 `index.ts` 中導出)

## 3. 分層依賴規則 (Classic Layers)

除了功能切片邊界，整個應用程式還遵循一個經典的分層依賴模型，這在切片內部和切片之間都適用：

**`UI層 (features)` -> `邏輯層 (hooks)` -> `狀態層 (context)` -> `設施層 (infra)`**

*   **UI層**: 只能向下依賴 `hooks` 和 `context`。
*   **邏輯層 (`hooks`)**: 可以依賴 `context` 和 `infra`。
*   **狀態層 (`context`)**: 可以依賴 `infra`。
*   **設施層 (`infra`)**: **最底層**，不依賴任何其他應用層。

嚴格遵守這些邊界是保證專案可擴展性和可維護性的基石。
