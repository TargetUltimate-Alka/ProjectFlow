# ProjectFlow API Specification

All external requests are routed through the **API Gateway** (`http://localhost:5000/api`).
The API Gateway forwards requests to individual microservices based on route prefixes.

---

## 🔐 1. Auth Service (`/api/auth`)
*Service Port: 5001 | Database: `auth_db`*

### `POST /api/auth/register`
Create a new user account (Student, Faculty, Admin).
- **Request Body**:
```json
{
  "name": "Nandini Kanaujiya",
  "email": "nandini@example.edu",
  "password": "SecurePassword123!",
  "role": "student" // "student" | "faculty" | "admin"
}
```
- **Response (201 Created)**:
```json
{
  "message": "User registered successfully",
  "user": { "id": "651f...", "name": "Nandini Kanaujiya", "email": "nandini@example.edu", "role": "student" }
}
```

### `POST /api/auth/login`
Authenticate user credentials and receive JWT.
- **Request Body**:
```json
{
  "email": "nandini@example.edu",
  "password": "SecurePassword123!"
}
```
- **Response (200 OK)**:
```json
{
  "token": "eyJhbGciOi...",
  "user": { "id": "651f...", "name": "Nandini Kanaujiya", "role": "student" }
}
```

### `GET /api/auth/me`
Retrieve authenticated user profile from token header (`Authorization: Bearer <token>`).

---

## 📁 2. Project Service (`/api/projects`)
*Service Port: 5002 | Database: `project_db`*

### `POST /api/projects`
Create a new academic project.
- **Request Body**:
```json
{
  "title": "ProjectFlow - Academic Platform",
  "description": "Microservices lifecycle platform",
  "techStack": ["React", "Node.js", "MongoDB", "RabbitMQ"],
  "members": ["user_id_1", "user_id_2"],
  "academicYear": "2025-2026"
}
```
- **Response (201 Created)**

### `GET /api/projects`
List projects (filtered by authenticated user's role or membership).

### `GET /api/projects/:id`
Get full details of a specific project (members, requirements, milestones).

### `PUT /api/projects/:id`
Update project details.

### `POST /api/projects/:id/milestones`
Add milestone submission to project.

---

## 📋 3. Task Service (`/api/tasks`)
*Service Port: 5003 | Database: `task_db`*

### `POST /api/tasks`
Create and assign a task.
- **Request Body**:
```json
{
  "projectId": "proj_123",
  "title": "Implement JWT Auth in Auth Service",
  "description": "Set up bcrypt and jsonwebtoken libraries",
  "assignedTo": "user_id_1",
  "priority": "High", // "Low" | "Medium" | "High"
  "dueDate": "2026-10-15"
}
```
- **Response (201 Created)**

### `GET /api/tasks/project/:projectId`
Retrieve all tasks for a project (used by Kanban board).

### `PUT /api/tasks/:id/status`
Update status of a task (`To Do` -> `In Progress` -> `In Review` -> `Done`).
- *Triggers RabbitMQ event `TASK_STATUS_UPDATED`*.

### `DELETE /api/tasks/:id`
Delete a task.

---

## 📊 4. Evaluation Service (`/api/evaluations`)
*Service Port: 5004 | Database: `evaluation_db`*

### `POST /api/evaluations`
Submit evaluation marks and feedback (Faculty only).
- **Request Body**:
```json
{
  "projectId": "proj_123",
  "milestoneId": "ms_01",
  "evaluatorId": "faculty_user_id",
  "rubrics": [
    { "criterion": "Architecture & Microservices", "maxMarks": 20, "obtainedMarks": 18 },
    { "criterion": "Code Quality & Documentation", "maxMarks": 10, "obtainedMarks": 9 }
  ],
  "totalMarks": 27,
  "feedback": "Well-structured microservices setup. Good separation of concerns."
}
```
- **Response (201 Created)**

### `GET /api/evaluations/project/:projectId`
Retrieve all evaluations and grades for a project.

---

## 🐙 5. Integration Service (`/api/integration`)
*Service Port: 5005 | Database: `integration_db`*

### `POST /api/integration/github/connect`
Connect GitHub repository to a project.
- **Request Body**:
```json
{
  "projectId": "proj_123",
  "repoUrl": "https://github.com/organization/projectflow",
  "branch": "main"
}
```

### `GET /api/integration/github/:projectId/summary`
Get aggregated statistics (commits count, pull requests, top contributors).

---

## 🔔 6. Notification Service (`/api/notifications`)
*Service Port: 5006 | Database: `notification_db`*

### `GET /api/notifications`
Get in-app notifications for the logged-in user.

### `PUT /api/notifications/:id/read`
Mark a notification as read.
