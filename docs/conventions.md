# 程式碼規範 (Coding Conventions)

本文件定義了專案的標準命名和結構約定，所有貢獻者都必須遵守。

## 1. 目錄與檔案命名 (`kebab-case`)

所有在 `src/features/` 目錄下的**目錄**和**檔案**（`.ts`, `.tsx`）都必須使用 **`kebab-case`** (小寫連字號)。

*   ✅ **正確**: `src/features/core/auth/_components/login-form.tsx`
*   ✅ **正確**: `src/features/workspaces/components/workspace-layout.tsx`
*   ❌ **錯誤**: `src/features/core/Auth/LoginPage.tsx`

全局目錄（如 `src/app`, `src/hooks`）也應遵循此規則，除非特定框架（如 Next.js 的動態路由 `[id]`）有特殊要求。

## 2. 元件與變數命名

*   **React 元件**: 在 `kebab-case` 的檔案名內部，React 元件本身應使用 **`PascalCase`**。
    *   檔案: `submit-button.tsx`
    *   元件: `export function SubmitButton() { ... }`

*   **變數與函式**: 使用 **`camelCase`**。
    *   `const activeAccount = ...`
    *   `function handleCreateWorkspace() { ... }`

*   **類型與介面**: 使用 **`PascalCase`**。
    *   `interface WorkspaceLayoutProps { ... }`

## 3. 私有模組約定 (`_` prefix)

任何以 `_` (底線) 開頭的目錄都被視為其父功能切片的**私有資產**。

*   **範例**: `src/features/core/auth/_components/`
*   **規則**: 此目錄下的檔案嚴禁被 `auth` 功能切片之外的任何模組引用。這是一條強制性的封裝規則，用於實現高內聚。

## 4. `index.ts` 桶子檔案

*   每個功能切片（如 `src/features/core/auth/`）都應有一個 `index.ts` 檔案，作為其對外暴露的**唯一公有接口**。
*   此檔案應只導出希望被其他切片消費的「高階」或「頁面級」元件，通常是來自於 `components/` 目錄。
*   嚴禁從 `index.ts` 中導出來自私有 `_` 目錄下的模組。

## 5. 數據流與依賴

*   嚴格遵循 `architecture.md` 和 `boundaries.md` 中定義的分層依賴規則。
*   **數據流向**: 單向數據流。UI 元件透過 Hooks 從 Context 獲取狀態，並透過 Hooks 調用基礎設施層 (Infra) 的方法來觸發變更。
*   **依賴方向**: `UI (Features) -> Hooks -> Context -> Infra`。上層可以依賴下層，但下層絕不能反向依賴上層。
