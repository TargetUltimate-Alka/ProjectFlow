# ProjectFlow System Architecture

## 1. Architectural Style: Microservices
ProjectFlow is structured using a decentralized **microservices architecture** to mirror the real-world Software Development Lifecycle (SDLC).

```
[ React Single Page Application (Client) ]
                   │
                   ▼ (HTTP / REST)
          [ Express API Gateway ]
                   │
  ┌────────┬───────┼───────┬────────┬────────┐
  ▼        ▼       ▼       ▼        ▼        ▼
 Auth   Project  Task   Evaluation  Integ.  Notif.
Service Service Service  Service   Service Service
  │        │       │       │        │        │
  ▼        ▼       ▼       ▼        ▼        ▼
auth_db proj_db task_db eval_db  integ_db notif_db
                   │       │
                   └───────┼────────► [ RabbitMQ Event Bus ]
                           │                   │
                           └───────────────────► Consumed by
                                                 Notification Service
```

---

## 2. Key Architectural Decisions

### 2.1 Database-per-Service
- **Strict Data Isolation**: Each microservice owns its private MongoDB database (`auth_db`, `project_db`, `task_db`, `evaluation_db`, `integration_db`, `notification_db`).
- **No Shared Tables/Collections**: Services never query or write to another service's database directly.
- **Reference by ID**: Cross-service associations are maintained strictly by storing opaque identifiers (e.g., `projectId`, `assignedToUserId`).

### 2.2 Synchronous Communication (REST via API Gateway)
- All client interactions pass through the **API Gateway** running on port `5000`.
- The Gateway provides reverse-proxy routing, CORS management, and unified entry point URLs (`/api/auth/*`, `/api/projects/*`, etc.).

### 2.3 Asynchronous Communication (RabbitMQ Event Bus)
- When state mutations occur that other services need to know about (e.g., `TASK_CREATED`, `TASK_COMPLETED`, `EVALUATION_POSTED`), services publish messages to RabbitMQ exchanges.
- The **Notification Service** listens for these topics asynchronously and updates user alerts without introducing latency to the main transaction.

---

## 3. Database Schemas Design

### `auth_db.users`
```json
{
  "_id": "ObjectId",
  "name": "String",
  "email": "String (unique)",
  "passwordHash": "String",
  "role": "student | faculty | admin",
  "department": "String",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

### `project_db.projects`
```json
{
  "_id": "ObjectId",
  "title": "String",
  "description": "String",
  "leaderId": "String (User ID)",
  "members": ["String (User IDs)"],
  "facultyMentorId": "String (User ID)",
  "academicYear": "String",
  "requirements": [
    {
      "code": "String (e.g. FR-01)",
      "description": "String",
      "priority": "High | Medium | Low",
      "status": "Proposed | Approved | Implemented"
    }
  ],
  "milestones": [
    {
      "title": "String",
      "dueDate": "Date",
      "status": "Pending | Submitted | Evaluated",
      "submissionUrl": "String"
    }
  ],
  "status": "Active | Completed",
  "createdAt": "Date"
}
```

### `task_db.tasks`
```json
{
  "_id": "ObjectId",
  "projectId": "String (Project ID)",
  "title": "String",
  "description": "String",
  "assignedTo": "String (User ID)",
  "status": "To Do | In Progress | In Review | Done",
  "priority": "Low | Medium | High",
  "dueDate": "Date",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

### `evaluation_db.evaluations`
```json
{
  "_id": "ObjectId",
  "projectId": "String (Project ID)",
  "milestoneId": "String",
  "facultyId": "String (User ID)",
  "rubrics": [
    {
      "criterion": "String",
      "maxMarks": "Number",
      "obtainedMarks": "Number"
    }
  ],
  "totalMarks": "Number",
  "feedback": "String",
  "evaluatedAt": "Date"
}
```

### `integration_db.github_sync`
```json
{
  "_id": "ObjectId",
  "projectId": "String (Project ID)",
  "repoOwner": "String",
  "repoName": "String",
  "totalCommits": "Number",
  "openPRs": "Number",
  "closedPRs": "Number",
  "contributors": [
    {
      "githubUsername": "String",
      "commits": "Number"
    }
  ],
  "lastSyncedAt": "Date"
}
```

### `notification_db.notifications`
```json
{
  "_id": "ObjectId",
  "recipientUserId": "String (User ID)",
  "type": "TASK_ASSIGNED | MILESTONE_DUE | EVALUATION_POSTED",
  "title": "String",
  "message": "String",
  "read": "Boolean",
  "createdAt": "Date"
}
```
