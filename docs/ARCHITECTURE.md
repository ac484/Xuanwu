# Architecture Diagrams

```mermaid
classDiagram

%% ==================================================
%% 1️⃣ Authentication Boundary (Identity Proof Only)
%% ==================================================

class AuthIdentity {
  +identityId
  +email
  +providers[]
}

class AuthSession {
  +sessionId
  +identityId
  +issuedAt
  +expiresAt
  +signature
}

AuthIdentity --> AuthSession


%% ==================================================
%% 2️⃣ Authorization Boundary (Access Control Model)
%% ==================================================

class AccessPrincipal {
  +principalId
  +identityId
  +type: human | system | bot
  +status
}

class AccessRole {
  +roleId
  +name
}

class AccessRoleAssignment {
  +assignmentId
  +principalId
  +roleId
  +scopeType: tenant | workspace
  +scopeId
}

class AccessPolicy {
  +policyId
  +roleId
  +action
  +resourceType
  +effect: allow | deny
}

AuthIdentity --> AccessPrincipal
AccessPrincipal --> AccessRoleAssignment
AccessRole --> AccessPolicy


%% ==================================================
%% 3️⃣ Tenant Governance Boundary
%% ==================================================

class TenantAggregate {
  +tenantId
  +type: personal | organization
  +status
  +createdAt
}

class TenantMember {
  +tenantId
  +principalId
  +joinedAt
}

class TenantPartnership {
  +partnershipId
  +sourceTenantId
  +targetTenantId
  +trustLevel
  +status
}

TenantAggregate --> TenantMember
TenantAggregate --> TenantPartnership


%% ==================================================
%% 4️⃣ Workspace Boundary (Execution Context)
%% ==================================================

class WorkspaceAggregate {
  +workspaceId
  +tenantId
  +status
  +visibility
}

class WorkspaceMember {
  +workspaceId
  +principalId
}

TenantAggregate --> WorkspaceAggregate
WorkspaceAggregate --> WorkspaceMember


%% ==================================================
%% 5️⃣ Work Domain Aggregates (Pure Domain Chain)
%% ==================================================

class TaskAggregate {
  +taskId
  +workspaceId
  +status: proposed | scheduled | completed
}

class QaAggregate {
  +qaId
  +taskId
  +status: pending | passed | failed
}

class AcceptanceAggregate {
  +acceptanceId
  +qaId
  +status: pending | accepted | rejected
}

class FinanceAggregate {
  +financeId
  +acceptanceId
  +status: pending | completed | failed
}

class IssueAggregate {
  +issueId
  +originAggregateType
  +originAggregateId
  +status: open | resolved | closed
}

WorkspaceAggregate --> TaskAggregate
TaskAggregate --> QaAggregate
QaAggregate --> AcceptanceAggregate
AcceptanceAggregate --> FinanceAggregate


%% ==================================================
%% 6️⃣ Resource Boundary (Passive Asset)
%% ==================================================

class FileAggregate {
  +fileId
  +workspaceId
  +name
  +type
  +url
}

WorkspaceAggregate --> FileAggregate


%% ==================================================
%% 7️⃣ Diary Aggregate (Content / Social)
%% ==================================================

class DiaryAggregate {
  +diaryId
  +workspaceId
  +authorPrincipalId
  +content
  +visibility: public | workspace | private
  +createdAt
  +status: active | archived
}

WorkspaceAggregate --> DiaryAggregate
DiaryAggregate --> DomainEvent


%% ==================================================
%% 8️⃣ External Service Boundary (No Aggregate Authority)
%% ==================================================

class DocumentParserService {
  +serviceId
  +supportedFileTypes[]
  +parse(fileId) -> TaskDraft[]
}

class TaskDraft {
  +draftId
  +workspaceId
  +data
}

FileAggregate --> DocumentParserService
DocumentParserService --> TaskDraft


%% ==================================================
%% 9️⃣ Command Boundary (Single Mutation Entry)
%% ==================================================

class DomainCommand {
  +commandId
  +principalId
  +workspaceId
  +payload
}

class CommandHandler {
  +handle(command)
}

AccessPrincipal --> DomainCommand
DomainCommand --> CommandHandler

CommandHandler --> TaskAggregate
CommandHandler --> QaAggregate
CommandHandler --> AcceptanceAggregate
CommandHandler --> FinanceAggregate
CommandHandler --> IssueAggregate
CommandHandler --> FileAggregate
CommandHandler --> WorkspaceAggregate
CommandHandler --> TenantAggregate
CommandHandler --> DiaryAggregate


%% ==================================================
%% 🔟 Event Boundary (Aggregate Origin Only)
%% ==================================================

class DomainEvent {
  +eventId
  +aggregateType
  +aggregateId
  +workspaceId
  +principalId
  +payload
  +occurredAt
}

class EventStore {
  +append(event)
  +load(aggregateId)
}

class ProjectionSubscriber {
  +handle(event)
}

TaskAggregate --> DomainEvent
QaAggregate --> DomainEvent
AcceptanceAggregate --> DomainEvent
FinanceAggregate --> DomainEvent
IssueAggregate --> DomainEvent
FileAggregate --> DomainEvent
WorkspaceAggregate --> DomainEvent
TenantAggregate --> DomainEvent
DiaryAggregate --> DomainEvent

DomainEvent --> EventStore
EventStore --> ProjectionSubscriber


%% ==================================================
%% 1️⃣1️⃣ Audit Boundary (System-level Tracking)
%% ==================================================

class AuditLog {
  +auditId
  +eventId
  +aggregateType
  +aggregateId
  +principalId
  +action
  +occurredAt
}

class AuditSubscriber {
  +handle(event)
}

DomainEvent --> AuditSubscriber
AuditSubscriber --> AuditLog


%% ==================================================
%% 🔒 Invariants (Hard Boundaries)
%% ==================================================

note for TaskAggregate
  tenantId 不存在
  僅透過 workspaceId 推導
end note

note for DomainEvent
  不能被外部 new
  只能由 Aggregate apply()
end note

note for DocumentParserService
  不具備 Aggregate 建立權
  只能產生 Draft
end note

note for CommandHandler
  唯一可變更 Aggregate 的入口
end note

note for AuditLog
  只讀紀錄，不影響 Domain
end note

note for DiaryAggregate
  屬於內容型 Aggregate
  可被 Command 建立與更新
  不參與 Task 流程鏈
end note
```
