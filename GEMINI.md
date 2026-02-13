# Core Tools & Capabilities Manual

This document is a complete description of the core tools and capabilities I can use as your AI assistant. It defines the function, use cases, and best practices for each tool.

---

## Core Principle: Proactive Tool Use to Optimize Token Consumption

**All tools listed in this manual are designed to transform complex requests into efficient, precise actions. In our interactions, I will proactively and preferentially use these tools to achieve the highest efficiency and lowest token consumption.**

*   **Codebase Understanding & Search**: I will prioritize using `repomix` and `next-devtools` tools to get context, rather than asking you to paste large amounts of code.
*   **Documentation Lookup**: I will prioritize using `context7` and `next-devtools` to query the latest official documentation, rather than relying on my potentially outdated internal knowledge.
*   **UI Component Operations**: I will prioritize using `shadcn` tools to get commands, rather than manually writing component code.

---

## 1. Sequential Thinking (`sequential-thinking`)

This is my core thinking framework for solving complex problems.

*   **`sequentialthinking`**
    *   **Function**: Decomposes a complex task (e.g., architecture refactoring, bug fixing) into a series of sequential, manageable, and correctable thinking steps.
    *   **When to Use**: When you present a complex request that requires multiple steps, in-depth analysis, or a strategy that might need adjustment mid-course, I will prioritize using this tool to plan my thinking path, ensuring the final solution is comprehensive and reliable.

---

## 2. Software Planning (`software-planning`)

This set of tools is specialized for project management and task tracking.

*   **`start_planning`**: When we begin a new feature or a large task, I will use this to initialize a new plan.
*   **`save_plan`**: Used during the planning process to save the implementation plan we've jointly developed.
*   **`add_todo`, `get_todos`, `remove_todo`, `update_todo_status`**: Used to manage and track specific to-do items under the plan, ensuring we don't miss any details.

---

## 3. Codebase Packing & Analysis (`repomix`)

This set of tools allows me to "read" and "understand" your entire codebase.

*   **`pack_codebase` / `pack_remote_repository`**: Packages a local or remote code repository into a single, easily analyzable file. This is my first step in understanding the project's overall picture.
*   **`generate_skill`**: Automatically generates a "skill package" from the codebase, allowing me to quickly learn and master your project's specific patterns and practices.
*   **`attach_packed_output`**: If you already have a packed codebase file, I can use this tool to load it directly.
*   **`read_repomix_output` / `grep_repomix_output`**: Allows me to read or search for specific content within the packed file.
*   **`file_system_read_file` / `file_system_read_directory`**: Provides secure, direct file system reading capabilities to get real-time information about a single file or directory structure.

---

## 4. `shadcn/ui` Component Library Management (`shadcn`)

This set of tools is specialized for managing and operating `shadcn/ui` components.

*   **`get_project_registries`**: Checks `components.json` to understand which component registries are configured in the project.
*   **`list_items_in_registries`, `search_items_in_registries`**: Lists or searches for available UI components.
*   **`view_items_in_registries`**: Views detailed information about a specific component (code, dependencies, etc.).
*   **`get_item_examples_from_registries`**: Finds official usage examples for a specific component.
*   **`get_add_command_for_items`**: **Most frequently used function**. When you ask to add a UI component, I will use this tool to generate the correct `npx shadcn-ui@latest add ...` command.
*   **`get_audit_checklist`**: After adding a component, provides a quick checklist to verify its functionality is normal.

---

## 5. Next.js Developer Tools (`next-devtools`)

This is my powerful toolset for interacting with a running Next.js development server.

*   **`nextjs_index`**: **Preferred tool**. Before making any modifications or diagnostics, I will first use it to detect all running Next.js services and list all their available MCP (Model Context Protocol) tools. This allows me to understand the application's real-time status, routes, and errors.
*   **`nextjs_call`**: Used after `nextjs_index` to execute a specific MCP tool (e.g., `get_errors`, `get_routes`).
*   **`nextjs_docs`**: Gets Next.js official documentation. I must first read the `nextjs-docs://llms-index` resource via `nextjs_index` to find the correct documentation path.
*   **`browser_eval`**: **Key for page verification**. I will use this tool to load pages in a real browser to capture runtime errors, rendering issues, and front-end interaction bugs that `curl` cannot find.
*   **`upgrade_nextjs_16`**: When you need to upgrade your project to Next.js v16, I will use this tool to guide the entire upgrade process, including automatically executing official codemods.
*   **`enable_cache_components`**: When you need to migrate to Next.js 16's Cache Components mode, I will use this tool to automate all related setup and code corrections.

---

## 6. Third-Party Documentation Lookup (`context7`)

When I need to query the latest documentation for any third-party library or framework other than Next.js, I will use this set of tools.

*   **`resolve-library-id`**: **First step**. Resolves the library name you mentioned (e.g., "react-hook-form") into a unique ID that the Context7 system can recognize.
*   **`query-docs`**: **Second step**. Uses the ID obtained in the previous step to query Context7 for the latest relevant documentation and code examples.
