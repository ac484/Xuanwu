import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
// @ts-ignore
import importPlugin from "eslint-plugin-import";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const compat = new FlatCompat({ baseDirectory: __dirname });

export default [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    plugins: { import: importPlugin },
    rules: {
      "import/no-restricted-paths": [
        "error",
        {
          zones: [
            // 1. 【Context 邊界】禁止在全域 context 根目錄直接建檔案，強制分類至子目錄
            {
              target: "./src/context/*.tsx",
              from: "./src",
              message: "\n❌ 物理邊界衝突：禁止在 src/context 根目錄直接建立檔案。\n請歸類至 src/context/core/ (底層) 或 src/context/ui/ (全域 UI)。"
            },

            // 2. 【Core 邊界】底層基礎設施（Firebase/Auth/i18n）嚴禁依賴任何 Feature 業務邏輯
            {
              target: ["./src/context/core", "./src/infra", "./src/core"],
              from: "./src/features",
              message: "\n❌ 物理邊界衝突：底層 Core/Infra 禁止引用 Features 業務邏輯，避免循環依賴。"
            },

            // 3. 【Hooks 邊界】全域 hooks 僅限存放純 UI 工具，嚴禁包含業務 actions
            {
              target: "./src/hooks",
              from: "./src/features",
              message: "\n❌ 物理邊界衝突：全域 src/hooks 僅限存放無國界 UI 工具 (如 use-toast)。\n請將業務 Actions 移回各別的 src/features/{name}/hooks 或 _hooks 中。"
            },

            // 4. 【Feature 私有邊界】禁止外部直接引用 Feature 的內部私有實作 (_開頭)
            {
              target: "./src",
              from: "./src/features/**/_*",
              message: "\n❌ 物理邊界衝突：帶底線的資料夾 (如 _hooks, _actions) 為 Feature 私有。\n外部僅能引用非底線開頭的入口檔案。"
            },

            // 5. 【App Router 邊界】強制頁面層級僅作為組裝，不應包含複雜邏輯
            {
              target: "./src/app",
              from: "./src/features/**/_hooks",
              message: "\n❌ 物理邊界衝突：App Pages 應透過 Feature 的公開 hooks 存取邏輯，禁止直接讀取 Feature 內部私有 Hook。"
            }
          ]
        }
      ],

      // 強制 Import 排序，讓「框」的概念反映在程式碼頂部
      "import/order": [
        "warn",
        {
          "groups": ["builtin", "external", "internal", ["parent", "sibling", "index"]],
          "pathGroups": [
            { "pattern": "react", "group": "external", "position": "before" },
            { "pattern": "next/**", "group": "external", "position": "before" },
            { "pattern": "@/context/core/**", "group": "internal", "position": "before" },
            { "pattern": "@/context/ui/**", "group": "internal", "position": "before" },
            { "pattern": "@/features/**", "group": "internal" }
          ],
          "pathGroupsExcludedImportTypes": ["react"],
          "newlines-between": "always",
          "alphabetize": { "order": "asc", "caseInsensitive": true }
        }
      ]
    }
  }
];