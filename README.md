# 組織界 (Soshikikai) - Organization World

**組織界 | モダンなワークスペースアーキテクチャ**
> From a single identity to a multi-dimensional organization.

This project is a comprehensive starter kit for building modern, collaborative workspace platforms using a cutting-edge technology stack. It's designed to manage complex organizational structures, from individual users to multi-faceted teams and partnerships.

## ✨ Features

*   **Multi-Dimensional Workspaces**: Create and manage distinct workspaces for different projects, teams, or business units.
*   **Hierarchical Governance**: Sophisticated role-based access control (Owner, Admin, Member, Guest).
*   **Team & Partner Management**: Organize internal teams and collaborate with external partners seamlessly.
*   **Daily Logging & Scheduling**: Keep track of daily activities and schedule events within workspaces.
*   **Audit Trails**: Maintain a complete history of activities for compliance and security.
*   **AI-Powered Features**: Integrated with Google's Genkit for AI-driven functionalities like document parsing.
*   **Comprehensive UI Kit**: A rich set of pre-built UI components based on `shadcn/ui`.
*   **Internationalization (i18n)**: Ready for global audiences with support for English, Japanese, German, and Traditional Chinese.

## 🚀 Tech Stack

*   **Framework**: [Next.js](https://nextjs.org/)
*   **Backend & DB**: [Firebase](https://firebase.google.com/) (Authentication, Firestore, Storage)
*   **AI**: [Google Genkit](https://firebase.google.com/docs/genkit)
*   **UI**: [React](https://react.dev/), [Tailwind CSS](https://tailwindcss.com/), [Shadcn/UI](https://ui.shadcn.com/)
*   **State Management**: React Context API
*   **Schema Validation**: [Zod](https://zod.dev/)
*   **Internationalization**: `i18next`-style JSON files

## 📂 Project Structure

The codebase is organized following a feature-based architecture to promote scalability and maintainability.

```
src
├── app/            # Next.js App Router: Pages, Layouts, and UI Components
├── context/        # Global React Context Providers
├── features/       # Modular feature domains (account, dashboard, workspaces)
├── hooks/          # Reusable React Hooks for logic and UI
├── infra/          # Infrastructure layer (Firebase SDK, repository pattern)
├── lib/            # Shared libraries and utilities
└── types/          # TypeScript type definitions
```

## 🏁 Getting Started

### 1. Prerequisites

*   Node.js (v18 or later)
*   Firebase Project

### 2. Installation

```bash
npm install
```

### 3. Firebase Setup

1.  Copy your Firebase project's configuration into `src/infra/firebase/firebase.config.ts`.
2.  Set up Firebase Authentication, Firestore, and Storage in your Firebase console.
3.  Configure Firestore security rules using `firestore.rules` and Storage rules using `storage.rules`.

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
