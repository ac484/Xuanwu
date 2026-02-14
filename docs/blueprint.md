# System Blueprint

This document outlines the system design, ensuring that the `blueprint.md` is in complete alignment with `ARCHITECTURE.md` and `backend.json`.

## 1. Authentication Boundary

- **Architecture:** `AuthIdentity`, `AuthSession`
- **Backend:** Pure authentication is handled by an external provider (e.g., Firebase Auth). The resulting `AuthIdentity` is not stored directly but is linked to an `AccessPrincipal` which represents the user within our system.
- **Firestore Collection:** Not applicable for `AuthIdentity`. See Authorization Boundary.

## 2. Authorization Boundary

- **Architecture:** `AccessPrincipal`, `AccessRole`, `AccessRoleAssignment`, `AccessPolicy`
- **Backend:** This boundary is implemented as defined in the architecture.
- **Firestore Collections:**
  - `/principals/{principalId}` (Schema: `AccessPrincipal`)
  - `/roles/{roleId}` (Schema: `AccessRole`)
  - `/roles/{roleId}/policies/{policyId}` (Schema: `AccessPolicy`)
  - `/roleAssignments/{assignmentId}` (Schema: `AccessRoleAssignment`)

## 3. Tenant Governance Boundary

- **Architecture:** `TenantAggregate`, `TenantMember`, `TenantPartnership`
- **Backend:** The `Tenant` entity represents the `TenantAggregate`.
- **Firestore Collections:**
  - `/tenants/{tenantId}` (Schema: `Tenant`)
  - `/tenants/{tenantId}/members/{principalId}` (Schema: `TenantMember`)
  - `/partnerships/{partnershipId}` (Schema: `TenantPartnership`)

## 4. Space Boundary

- **Architecture:** `SpaceAggregate`, `SpaceMember`
- **Backend:** The `Space` entity represents the `SpaceAggregate`. `SpaceMember` is a distinct entity.
- **Firestore Collections:**
  - `/tenants/{tenantId}/spaces/{spaceId}` (Schema: `Space`)
  - `/tenants/{tenantId}/spaces/{spaceId}/members/{principalId}` (Schema: `SpaceMember`)

## 5. Work Domain Aggregates

This boundary contains the core business logic aggregates, all stored as sub-collections within a space.

- **Architecture:** `TaskAggregate`, `QaAggregate`, `AcceptanceAggregate`, `FinanceAggregate`, `IssueAggregate`
- **Backend Entities:** `Task`, `QA`, `Acceptance`, `Finance`, `Issue`
- **Firestore Sub-collections:**
  - `/tenants/{tenantId}/spaces/{spaceId}/tasks/{taskId}` (Schema: `Task`)
  - `/tenants/{tenantId}/spaces/{spaceId}/qas/{qaId}` (Schema: `QA`)
  - `/tenants/{tenantId}/spaces/{spaceId}/acceptances/{acceptanceId}` (Schema: `Acceptance`)
  - `/tenants/{tenantId}/spaces/{spaceId}/finances/{financeId}` (Schema: `Finance`)
  - `/tenants/{tenantId}/spaces/{spaceId}/issues/{issueId}` (Schema: `Issue`)

## 6. Resource Boundary

- **Architecture:** `FileAggregate`
- **Backend:** The `File` entity represents a passive resource.
- **Firestore Sub-collection:** `/tenants/{tenantId}/spaces/{spaceId}/files/{fileId}`

## 7. Diary Aggregate

- **Architecture:** `DiaryAggregate`
- **Backend:** The `Diary` entity represents a content/social entry.
- **Firestore Sub-collection:** `/tenants/{tenantId}/spaces/{spaceId}/diaries/{diaryId}`

## 8. External Service Boundary (Conceptual)

- **Architecture:** `DocumentParserService`, `TaskDraft`
- **Backend:** This remains a conceptual boundary. The service processes files to create `TaskDraft`s, which are then used to create `Task` aggregates. This is not directly defined in `backend.json`.

## 9. Command Boundary (Conceptual)

- **Architecture:** `DomainCommand`, `CommandHandler`
- **Backend:** This remains a conceptual boundary representing the sole entry points for mutations (e.g., API endpoints, cloud functions).

## 10. Event Boundary (Conceptual)

- **Architecture:** `DomainEvent`, `EventStore`, `ProjectionSubscriber`
- **Backend:** This remains a conceptual boundary. Aggregates generate events, which are persisted and handled by subscribers.

## 11. Audit Boundary

- **Architecture:** `AuditLog`, `AuditSubscriber`
- **Backend:** The `AuditLog` provides a system-level audit trail.
- **Firestore Sub-collection:** `/tenants/{tenantId}/auditLogs/{logId}`
