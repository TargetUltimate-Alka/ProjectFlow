# Software Requirements Specification (SRS)

## Project: ProjectFlow
**A Project Lifecycle and Evaluation Platform for Academic Software Projects**

---

## 1. Introduction

### 1.1 Purpose
This document specifies the software requirements for ProjectFlow, a centralized microservices-based web platform designed to streamline software engineering lifecycle management, supervision, and evaluation in academic environments.

### 1.2 Scope
ProjectFlow integrates requirement specification, sprint/task management, milestone submission, GitHub activity tracking, faculty review, and automated evaluation metrics into a single unified web platform.

---

## 2. Overall Description

### 2.1 Product Perspective
ProjectFlow replaces disparate tools (Google Drive, WhatsApp/Slack, Trello, Excel spreadsheets, GitHub raw links) with a cohesive system tailored specifically to university project curriculum workflows.

### 2.2 User Classes and Characteristics
1. **Student**: Creates projects, forms teams, creates user stories/requirements, assigns tasks, commits code to GitHub, submits milestones.
2. **Faculty (Mentor/Evaluator)**: Monitors project sprint progress, tracks individual student contributions, reviews submissions, provides qualitative feedback, marks milestones based on standardized rubrics.
3. **Administrator**: Configures cohorts, course batches, registers students and faculty, assigns faculty mentors to teams, manages overall evaluation weightages.

---

## 3. Functional Requirements

### 3.1 Authentication & User Management (Auth Service)
- **FR-01**: The system shall allow users (Students, Faculty, Admin) to register with institutional email addresses and login using secure JWT tokens.
- **FR-02**: The system shall enforce Role-Based Access Control (RBAC) across all protected routes and API endpoints.
- **FR-03**: The system shall provide password reset and profile update capabilities.

### 3.2 Project & Team Management (Project Service)
- **FR-04**: Students shall be able to create a project with title, abstract, domain, and technology stack.
- **FR-05**: Students shall be able to invite teammates or accept team invitations up to the configured team size limit.
- **FR-06**: Faculty and Admins shall be able to view all assigned project details, member rosters, and project status.
- **FR-07**: Students shall be able to record, update, and categorize functional/non-functional requirements with traceability tags.
- **FR-08**: Teams shall be able to submit project milestones with attached deliverables and documentation.

### 3.3 Task & Workflow Management (Task Service)
- **FR-09**: Students shall be able to create tasks with title, description, priority (Low, Medium, High), deadline, and assignee.
- **FR-10**: The system shall provide an interactive Kanban board (To Do, In Progress, In Review, Done).
- **FR-11**: The system shall calculate individual and team task completion velocity and health indicators.

### 3.4 GitHub Integration (Integration Service)
- **FR-12**: Teams shall be able to connect their GitHub repository URL via OAuth / Personal Access Token or Webhook.
- **FR-13**: The system shall fetch repository commit history, pull request status, and issue counts.
- **FR-14**: The system shall map GitHub usernames to registered student team members to compute individual commit/contribution metrics.

### 3.5 Evaluation & Grading (Evaluation Service)
- **FR-15**: Faculty shall be able to view project deliverables per milestone and assign marks based on customizable rubrics.
- **FR-16**: Faculty shall provide written qualitative feedback on milestone submissions.
- **FR-17**: Admins shall be able to aggregate final grades and export evaluation reports (CSV/PDF).

### 3.6 Notifications & Event Bus (Notification Service)
- **FR-18**: The system shall dispatch in-app notifications on critical events (Task assignment, Milestone deadline alert, Faculty feedback posted, Evaluation submitted).

---

## 4. Non-Functional Requirements

### 4.1 Security
- Passwords must be hashed using `bcrypt` (salt rounds $\ge$ 10).
- Stateless authentication using signed JSON Web Tokens (JWT) passed in `Authorization: Bearer <token>` headers.
- Services shall communicate internally through private Docker network without exposing internal database ports publicly in production.

### 4.2 Performance
- API response times for standard CRUD operations shall be $< 300\text{ ms}$ under standard lab concurrency (up to 200 concurrent users).
- GitHub synchronization shall be processed asynchronously to avoid blocking user interactions.

### 4.3 Availability & Fault Tolerance
- Failure of a secondary service (e.g., Notification or Integration Service) shall not bring down critical path services (Auth, Project, Task).

### 4.4 Maintainability & Scalability
- Microservices adhere to Single Responsibility Principle (SRP) with independent databases.
- Monorepo structure allows modular development, CI/CD pipeline integration, and automated containerization.
