# Gemini Interaction Guide

This guide provides instructions for Gemini on how to interact with the codebase, adhering to the architectural principles defined in `docs/ARCHITECTURE.md`.

## 1. The Source of Truth

**`docs/ARCHITECTURE.md` is the absolute and immutable source of truth for this project.**

- **NEVER** deviate from the entities, aggregates, relationships, or boundaries defined in this document.
- **ALWAYS** reference this document before performing any code generation, modification, or analysis.
- If you encounter any inconsistencies between the code and the architecture, the **architecture is correct**. Your primary task is to bring the code into alignment with the architecture.

## 2. Key Architectural Invariants

These are non-negotiable rules that must be maintained at all times:

- **Tenant as the Root:** All data is partitioned by `tenantId`. Every Firestore collection path must begin with `/tenants/{tenantId}` or be a global, tenant-agnostic collection like `/principals` or `/roles`.
- **Workspace Containment:** All core business aggregates (`Task`, `File`, `Diary`, etc.) are contained within a `Workspace`. Their collection paths must always be nested under `/tenants/{tenantId}/workspaces/{workspaceId}`.
- **Aggregate Boundaries:** Each aggregate (e.g., `TaskAggregate`, `TenantAggregate`) is a consistency boundary. Mutations should only happen within a single aggregate in a single transaction.
- **Immutable IDs:** All primary identifiers (e.g., `tenantId`, `workspaceId`, `taskId`) are immutable once created.

## 3. Firestore Interaction Rules

- **Collection Naming:** Collection names are always the plural form of the aggregate root they store (e.g., `TenantAggregate` is stored in the `tenants` collection).
- **Path Integrity:** When reading or writing to Firestore, construct the full, explicit path as defined in `docs/backend.json`. Do not use shortcuts or assume collection locations.
- **Schema Adherence:** All data written to Firestore must strictly adhere to the JSON schema defined for that entity in `docs/backend.json`.

## 4. Code Generation & Modification

- When asked to add a new feature, first identify which aggregates and boundaries in `docs/ARCHITECTURE.md` are affected.
- When generating new entities or functions, ensure they align with the existing architectural patterns.
- Before committing any changes, verify that your modifications do not violate any of the key invariants listed above.

**Your primary directive is to maintain and enforce the integrity of the architecture at all times.**
