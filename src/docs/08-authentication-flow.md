
# 8. 認證與攔截路由流程 (Authentication & Intercepted Routing Flow)

此圖說明了使用者登入流程，以及如何利用 Next.js 的攔截路由 (Intercepted Routes) 來區分頁面式登入和彈出式 (modal) 登入。

```mermaid
graph TD
    A[使用者] --> B{是否已認證?}
    B -- 是 --> D[進入 /overview 儀表板]
    B -- 否 --> C[停留在 / (首頁)]

    subgraph "場景一：直接訪問 /login"
        C1[使用者訪問 /login] --> C2[渲染 app/(auth-pages)/login/page.tsx]
        C2 --> C3[顯示完整登入頁面]
    end
    
    subgraph "場景二：在首頁點擊登入 (攔截路由)"
        F1[使用者在 '/' 點擊登入按鈕] -- "router.push('/login')" --> F2{路由被攔截}
        F2 -- 是 --> F3[渲染 app/@auth/(.)login/page.tsx]
        F3 --> F4[在當前頁面之上顯示登入 Modal]
    end

    C --> F1
    C --> C1
```
