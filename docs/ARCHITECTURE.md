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
  +scopeType: tenant | space
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
%% 4️⃣ Space Boundary (Execution Context)
%% ==================================================

class SpaceAggregate {
  +spaceId
  +tenantId
  +status
  +visibility
}

class SpaceMember {
  +spaceId
  +principalId
}

TenantAggregate --> SpaceAggregate
SpaceAggregate --> SpaceMember


%% ==================================================
%% 5️⃣ Work Domain Aggregates (Pure Domain Chain)
%% ==================================================

class TaskAggregate {
  +taskId
  +spaceId
  +status: proposed | scheduled | completed
  +assigneePrincipalId
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

SpaceAggregate --> TaskAggregate
TaskAggregate --> QaAggregate
QaAggregate --> AcceptanceAggregate
AcceptanceAggregate --> FinanceAggregate


%% ==================================================
%% 6️⃣ Resource Boundary (Passive Asset)
%% ==================================================

class FileAggregate {
  +fileId
  +spaceId
  +name
  +type
  +url
  +sizeBytes
}

SpaceAggregate --> FileAggregate


%% ==================================================
%% 7️⃣ Diary Aggregate (Content / Social)
%% ==================================================

class DiaryAggregate {
  +diaryId
  +spaceId
  +authorPrincipalId
  +content
  +visibility: public | space | private
  +createdAt
  +status: active | archived
}

SpaceAggregate --> DiaryAggregate


%% ==================================================
%% 8️⃣ External Service Boundary (No Aggregate Authority)
%% ==================================================

class DocumentParserService {
  +serviceId
  +supportedFileTypes[]
  +parse(fileId) TaskDraft[]
}

class TaskDraft {
  +draftId
  +spaceId
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
  +spaceId
  +payload
  +issuedAt
}

class CommandHandler {
  +handle(command) Result~Event[]~
  +validate(command) ValidationResult
}

class CommandResult {
  +success: boolean
  +events: Event[]
  +error?: DomainError
}

AccessPrincipal --> DomainCommand
DomainCommand --> CommandHandler
CommandHandler --> CommandResult

CommandHandler --> TaskAggregate
CommandHandler --> QaAggregate
CommandHandler --> AcceptanceAggregate
CommandHandler --> FinanceAggregate
CommandHandler --> IssueAggregate
CommandHandler --> FileAggregate
CommandHandler --> SpaceAggregate
CommandHandler --> TenantAggregate
CommandHandler --> DiaryAggregate


%% ==================================================
%% 🔟 Event Boundary (Aggregate Origin Only)
%% ==================================================

class DomainEvent {
  +eventId
  +aggregateType
  +aggregateId
  +spaceId
  +principalId
  +payload
  +occurredAt
  +version: number
}

class EventStore {
  +append(event) void
  +load(aggregateId) Event[]
  +loadFromVersion(aggregateId, version) Event[]
}

class EventSchema {
  +schemaId
  +eventType
  +version: number
  +fields[]
}

class EventUpgrader {
  +upgrade(oldEvent, targetVersion) Event
  +canUpgrade(fromVersion, toVersion) boolean
}

TaskAggregate --> DomainEvent
QaAggregate --> DomainEvent
AcceptanceAggregate --> DomainEvent
FinanceAggregate --> DomainEvent
IssueAggregate --> DomainEvent
FileAggregate --> DomainEvent
SpaceAggregate --> DomainEvent
TenantAggregate --> DomainEvent
DiaryAggregate --> DomainEvent

DomainEvent --> EventStore
DomainEvent --> EventSchema
EventSchema --> EventUpgrader


%% ==================================================
%% 1️⃣1️⃣ Query Boundary (Read Model Access)
%% ==================================================

class DomainQuery {
  +queryId
  +principalId
  +spaceId?
  +filters: FilterCriteria
  +pagination: Pagination
}

class QueryHandler {
  +handle(query) ReadModel
  +validate(query) ValidationResult
}

class ReadModel {
  +modelId
  +modelType
  +data
  +lastUpdatedAt
  +version: number
}

class FilterCriteria {
  +field: string
  +operator: eq | gt | lt | in
  +value: any
}

class Pagination {
  +page: number
  +pageSize: number
  +totalCount?: number
}

AccessPrincipal --> DomainQuery
DomainQuery --> QueryHandler
QueryHandler --> ReadModel
DomainQuery --> FilterCriteria
DomainQuery --> Pagination


%% ==================================================
%% 1️⃣2️⃣ Projection Boundary (Event → Read Model)
%% ==================================================

class Projection {
  +projectionId
  +name
  +eventTypes[]
  +status: active | rebuilding | failed
  +rebuild() void
}

class ProjectionSubscriber {
  +handle(event) void
  +updateReadModel(event) void
}

class ProjectionState {
  +projectionId
  +lastProcessedEventId
  +lastProcessedAt
  +checkpointData
}

class ProjectionCheckpoint {
  +save(state) void
  +load(projectionId) ProjectionState
}

EventStore --> ProjectionSubscriber
ProjectionSubscriber --> Projection
Projection --> ProjectionState
ProjectionState --> ProjectionCheckpoint
ProjectionSubscriber --> ReadModel


%% ==================================================
%% 1️⃣3️⃣ Error Boundary (Failure Handling)
%% ==================================================

class DomainError {
  +errorId
  +commandId?
  +aggregateId?
  +code: string
  +message: string
  +occurredAt
  +stackTrace?
}

class ErrorHandler {
  +handle(error) void
  +retry(commandId) CommandResult
  +canRetry(error) boolean
}

class DeadLetterQueue {
  +queueId
  +failedCommandId
  +error: DomainError
  +retryCount: number
  +maxRetries: number
}

CommandHandler --> DomainError
DomainError --> ErrorHandler
ErrorHandler --> DeadLetterQueue


%% ==================================================
%% 1️⃣4️⃣ Process Manager Boundary (Workflow Orchestration)
%% ==================================================

class ProcessManager {
  +processId
  +taskId
  +currentStage: task | qa | acceptance | finance
  +status: running | completed | failed | compensating
  +startedAt
  +completedAt?
}

class ProcessStep {
  +stepId
  +processId
  +stageName
  +status: pending | completed | failed
  +retriesCount: number
}

class CompensationHandler {
  +compensate(processId) void
  +rollback(stepId) void
}

TaskAggregate --> ProcessManager
ProcessManager --> ProcessStep
ProcessManager --> CompensationHandler
ProcessStep --> DomainCommand


%% ==================================================
%% 1️⃣5️⃣ Notification Boundary (User Communication)
%% ==================================================

class NotificationAggregate {
  +notificationId
  +recipientPrincipalId
  +type: email | push | in_app
  +title
  +body
  +payload
  +status: pending | sent | failed | read
  +createdAt
  +sentAt?
}

class NotificationSubscriber {
  +handle(event) void
  +createNotification(event) NotificationAggregate
}

class NotificationTemplate {
  +templateId
  +eventType
  +channelType
  +template: string
}

DomainEvent --> NotificationSubscriber
NotificationSubscriber --> NotificationAggregate
NotificationSubscriber --> NotificationTemplate


%% ==================================================
%% 1️⃣6️⃣ Search Boundary (Full-text Search)
%% ==================================================

class SearchIndex {
  +indexId
  +spaceId
  +aggregateType
  +aggregateId
  +content: string
  +metadata
  +lastIndexedAt
}

class SearchService {
  +index(event) void
  +search(query) SearchResult[]
  +reindex(aggregateId) void
}

class SearchResult {
  +resultId
  +aggregateType
  +aggregateId
  +score: number
  +highlights[]
}

DomainEvent --> SearchService
SearchService --> SearchIndex
SearchService --> SearchResult


%% ==================================================
%% 1️⃣7️⃣ Quota Boundary (Resource Limiting)
%% ==================================================

class QuotaPolicy {
  +policyId
  +tenantId
  +resourceType: task | file | space | storage
  +limit: number
  +period: daily | monthly | total
}

class QuotaUsage {
  +usageId
  +tenantId
  +resourceType
  +currentUsage: number
  +resetAt?
}

class QuotaEnforcer {
  +check(principalId, resourceType) boolean
  +increment(tenantId, resourceType) void
  +decrement(tenantId, resourceType) void
}

TenantAggregate --> QuotaPolicy
QuotaPolicy --> QuotaUsage
QuotaUsage --> QuotaEnforcer
CommandHandler --> QuotaEnforcer


%% ==================================================
%% 1️⃣8️⃣ Audit Boundary (System-level Tracking)
%% ==================================================

class AuditLog {
  +auditId
  +eventId
  +aggregateType
  +aggregateId
  +principalId
  +action
  +occurredAt
  +ipAddress?
  +userAgent?
}

class AuditSubscriber {
  +handle(event) void
  +createAuditLog(event) AuditLog
}

DomainEvent --> AuditSubscriber
AuditSubscriber --> AuditLog


%% ==================================================
%% 🔒 Invariants (Hard Boundaries)
%% ==================================================

note for TaskAggregate
  tenantId 不存在
  僅透過 spaceId 推導
end note

note for DomainEvent
  不能被外部 new
  只能由 Aggregate apply()
  必須包含 version 欄位
end note

note for DocumentParserService
  不具備 Aggregate 建立權
  只能產生 Draft
end note

note for CommandHandler
  唯一可變更 Aggregate 的入口
  必須先通過 QuotaEnforcer 檢查
  失敗時產生 DomainError
end note

note for QueryHandler
  只能讀取 ReadModel
  不能直接存取 EventStore
  必須通過 AccessPolicy 檢查
end note

note for AuditLog
  只讀紀錄，不影響 Domain
  每個 Event 必須產生 AuditLog
end note

note for DiaryAggregate
  屬於內容型 Aggregate
  可被 Command 建立與更新
  不參與 Task 流程鏈
  可被全文檢索
end note

note for ProcessManager
  唯一協調 Task 流程鏈的組件
  失敗時觸發 CompensationHandler
  不直接操作 Aggregate
end note

note for NotificationAggregate
  由 Event 觸發產生
  不影響核心 Domain
  失敗不影響業務流程
end note

note for ReadModel
  由 Projection 維護
  不可被 Command 直接修改
  可以被刪除並重建
end note

note for QuotaEnforcer
  在 Command 執行前檢查
  超過限制時拒絕 Command
  不可被繞過
end note
```

---

## 📝 關鍵變更說明

### ✅ **新增的邊界**

1. **Query Boundary** - 完整的查詢機制
2. **Projection Boundary** - Event → Read Model 投影
3. **Error Boundary** - 錯誤處理與重試
4. **Process Manager** - 流程協調與補償
5. **Notification Boundary** - 用戶通知
6. **Search Boundary** - 全文檢索
7. **Quota Boundary** - 資源限制

### ✅ **強化的不變式 (Invariants)**

- CommandHandler 必須通過 QuotaEnforcer
- QueryHandler 只能讀 ReadModel
- ProcessManager 是唯一流程協調者
- Event 必須包含 version

### ✅ **補充的屬性**

- `TaskAggregate.assigneePrincipalId` (用於通知)
- `FileAggregate.sizeBytes` (用於配額計算)
- `DomainEvent.version` (用於事件升級)

---