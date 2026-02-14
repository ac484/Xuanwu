# Project README

This project's architecture is defined and enforced by the contents of `docs/ARCHITECTURE.md`. This file serves as the single source of truth for all system boundaries, aggregates, and data flow.

## Core Principles

- **Tenant-First:** All data is strictly partitioned by `tenantId`.
- **Workspace Containment:** Core business logic resides within a `Workspace`.
- **Immutable IDs:** All primary keys are immutable.

## System Overview

The system is designed around a set of clearly defined boundaries:

1.  **Authentication & Authorization:** Manages identity and access control.
2.  **Tenant Governance:** Manages the top-level tenants and their members.
3.  **Workspace:** The primary container for all work-related data and logic.
4.  **Work Domain Aggregates:** The core chain of business processes (`Task` -> `QA` -> `Acceptance` -> `Finance`).
5.  **Supporting Boundaries:** Includes resources (`File`), content (`Diary`), and system-level logging (`AuditLog`).

For a detailed breakdown of the architecture, data models, and Firestore collections, please refer to:

- **`docs/ARCHITECTURE.md`**: The definitive architectural diagrams.
- **`docs/blueprint.md`**: A human-readable guide to the system's implementation.
- **`docs/backend.json`**: The machine-readable schema for all entities and Firestore paths.
