# 核心工具與能力手冊 (Core Tools & Capabilities Manual)

本文件是我作為您的 AI 助理所能使用的核心工具與能力的完整說明。它定義了每個工具的功能、使用時機與最佳實踐。

---

## 核心原則：積極使用工具，優化 Token 消耗

**本手冊中列出的所有工具，都是為了將複雜的請求轉化為高效、精準的操作。在我們的互動中，我會積極且優先地使用這些工具，以達到最高效率和最低的 token 消耗。**

*   **程式碼庫理解與搜索**: 我會優先使用 `repomix` 和 `next-devtools` 工具來獲取上下文，而不是要求您貼上大量程式碼。
*   **文件查詢**: 我會優先使用 `context7` 和 `next-devtools` 來查詢最新的官方文件，而不是依賴我內存的可能過時的知識。
*   **UI 元件操作**: 我會優先使用 `shadcn` 工具來獲取指令，而不是手動編寫元件程式碼。

---

## 1. 序列化思考 (`sequential-thinking`)

這是我解決複雜問題的核心思維框架。

*   **`sequentialthinking`**
    *   **功能**: 將一個複雜的任務（例如：架構重構、Bug 修復）分解成一系列循序漸進、可管理、可修正的思考步驟。
    *   **使用時機**: 當您提出一個需要多步驟、深入分析或可能需要中途調整策略的複雜請求時，我會優先使用此工具來規劃我的思考路徑，確保最終產出的解決方案是全面且可靠的。

---

## 2. 軟體規劃 (`software-planning`)

這套工具專門用於專案管理和任務追蹤。

*   **`start_planning`**: 當我們開始一個新功能或一個大型任務時，我會用它來初始化一個新的計畫。
*   **`save_plan`**: 在規劃過程中，用來保存我們共同制定的實施計畫。
*   **`add_todo`, `get_todos`, `remove_todo`, `update_todo_status`**: 用於管理和追蹤該計畫下的具體待辦事項，確保我們不會遺漏任何細節。

---

## 3. 程式碼庫打包與分析 (`repomix`)

這套工具讓我能夠「閱讀」和「理解」您的整個程式碼庫。

*   **`pack_codebase` / `pack_remote_repository`**: 將本地或遠端的程式碼倉庫打包成一個單一、便於分析的檔案。這是我理解專案全貌的第一步。
*   **`generate_skill`**: 從程式碼庫中自動生成一個「技能包」，讓我能快速學習並掌握您專案的特定模式和實踐。
*   **`attach_packed_output`**: 如果您已經有一個打包好的程式碼庫檔案，我可以使用此工具直接載入它。
*   **`read_repomix_output` / `grep_repomix_output`**: 讓我能讀取或搜尋打包檔案內的特定內容。
*   **`file_system_read_file` / `file_system_read_directory`**: 提供安全、直接的檔案系統讀取能力，用於獲取單一檔案或目錄結構的即時資訊。

---

## 4. `shadcn/ui` 元件庫管理 (`shadcn`)

這套工具專門用於管理和操作 `shadcn/ui` 元件。

*   **`get_project_registries`**: 檢查 `components.json` 以了解專案中配置了哪些元件註冊表。
*   **`list_items_in_registries`, `search_items_in_registries`**: 列出或搜尋可用的 UI 元件。
*   **`view_items_in_registries`**: 查看特定元件的詳細資訊（程式碼、依賴等）。
*   **`get_item_examples_from_registries`**: 尋找特定元件的官方使用範例。
*   **`get_add_command_for_items`**: **最常用的功能**。當您要求新增 UI 元件時，我會用此工具產生正確的 `npx shadcn-ui@latest add ...` 指令。
*   **`get_audit_checklist`**: 在新增元件後，提供一個快速的檢查清單以驗證其功能是否正常。

---

## 5. Next.js 開發者工具 (`next-devtools`)

這是我與正在運行的 Next.js 開發伺服器互動的強大工具集。

*   **`nextjs_index`**: **首選工具**。在進行任何修改或診斷之前，我會先用它來偵測所有正在運行的 Next.js 服務，並列出它們可用的所有 MCP (Model Context Protocol) 工具。這能讓我了解應用的即時狀態、路由和錯誤。
*   **`nextjs_call`**: 在 `nextjs_index` 之後使用，用來執行特定的 MCP 工具（例如：`get_errors`, `get_routes`）。
*   **`nextjs_docs`**: 獲取 Next.js 官方文件。我必須先透過 `nextjs_index` 讀取 `nextjs-docs://llms-index` 資源來找到正確的文件路徑。
*   **`browser_eval`**: **頁面驗證的關鍵**。我會使用此工具在真實瀏覽器中載入頁面，以捕捉 `curl` 無法發現的運行時錯誤、渲染問題和前端互動 Bug。
*   **`upgrade_nextjs_16`**: 當您需要將專案升級到 Next.js v16 時，我會使用此工具來指導整個升級流程，包括自動執行官方的 codemods。
*   **`enable_cache_components`**: 當您需要遷移到 Next.js 16 的 Cache Components 模式時，我會使用此工具來自動化完成所有相關的設定和程式碼修正。

---

## 6. 第三方文件查詢 (`context7`)

當我需要查詢 Next.js 以外的、任何第三方函式庫或框架的最新文件時，我會使用這套工具。

*   **`resolve-library-id`**: **第一步**。將您提到的函式庫名稱（例如 "react-hook-form"）解析為 Context7 系統可識別的唯一 ID。
*   **`query-docs`**: **第二步**。使用上一步獲取的 ID，向 Context7 查詢相關的最新文件和程式碼範例。
