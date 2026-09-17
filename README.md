# ProjectFlow

> **A project lifecycle and evaluation platform specifically designed for academic software projects.**

---

## 📌 1. Problem Statement

Academic software projects involve multiple activities such as requirements management, task allocation, development, version control, milestone tracking, documentation, faculty supervision, and evaluation. 

These activities are often managed using fragmented tools (messaging applications, spreadsheets, cloud storage, separate source-code repositories), resulting in:
- **Fragmented project information** and loss of context.
- **Limited project visibility** for both team members and faculty.
- **Difficulty in tracking individual contributions** accurately.
- **Inefficient and delayed faculty supervision** and grading.

**ProjectFlow** provides a centralized platform that manages the complete academic software project lifecycle and connects students, faculty, and administrators through a unified system.

---

## 💡 2. Proposed Solution

ProjectFlow is a **microservice-based MERN web platform** designed to manage the lifecycle of academic software projects:
- **Students**: Manage requirements, tasks, milestones, documentation, and GitHub activity; track team health and deadlines.
- **Faculty**: Monitor project progress, review milestones, inspect commit activities, give targeted feedback, and evaluate submissions against rubrics.
- **Administrators**: Manage user accounts (students/faculty), create project cohorts, assign supervisors, and configure evaluation criteria.

---

## 👥 3. System Actors & Use Cases

```
                    PROJECTFLOW
                         │
        ┌────────────────┼────────────────┐
        │                │                │
     Student          Faculty           Admin
```

### 🎓 Student
- Register & Login (JWT authentication)
- Create and join project teams
- Define and track project requirements
- Create, assign, and update tasks (Kanban/Board)
- Set and submit milestones with documentation
- Connect GitHub repositories to sync commits and PRs
- View real-time project progress and health metrics

### 👨‍🏫 Faculty
- Login & access assigned project dashboards
- Review requirements and provide architectural feedback
- Monitor task completion velocity and sprint health
- Review submitted milestones and documents
- Evaluate projects and record marks/rubric assessments

### 🛡️ Admin
- Manage student and faculty accounts
- Create academic terms, project batches, and quotas
- Assign faculty supervisors to project teams
- Configure evaluation criteria and weightages
- Access system-wide audit and analytics dashboard

---

## 🏗️ 4. Microservices Architecture

The system implements the **Database-per-Service** pattern to ensure loose coupling, high cohesion, and independent scalability.

```
                         React Frontend (:3000)
                                   │
                                   ▼
                         API Gateway (:5000)
                                   │
       ┌───────────────────┬───────┴───────────┬───────────────────┐
       │                   │                   │                   │
       ▼                   ▼                   ▼                   ▼
  Auth Service      Project Service       Task Service     Evaluation Service
     (:5001)             (:5002)             (:5003)             (:5004)
       │                   │                   │                   │
       ▼                   ▼                   ▼                   ▼
    auth_db             project_db          task_db          evaluation_db
       │                   │                   │                   │
       └───────────────────┴─────────┬─────────┴───────────────────┘
                                     │
                                     ▼
                          Integration Service (:5005) ───► integration_db
                                     │
                                     ▼ (Event Bus: RabbitMQ)
                          Notification Service (:5006) ──► notification_db
```

### 📦 Services & Ports

| Service | Port | Database | Primary Responsibility |
| :--- | :--- | :--- | :--- |
| **Frontend** | `3000` | — | Single Page React Application (Tailwind CSS, Axios) |
| **API Gateway** | `5000` | — | Reverse proxy, request routing, centralized JWT verification |
| **Auth Service** | `5001` | `auth_db` | Authentication, JWT issue/refresh, User profiles, Roles |
| **Project Service** | `5002` | `project_db` | Projects, Team formation, Requirements, Milestones |
| **Task Service** | `5003` | `task_db` | Task lifecycle, Status, Priorities, Assignments |
| **Evaluation Service**| `5004` | `evaluation_db`| Rubrics, Grading, Faculty reviews, Marks |
| **Integration Service**| `5005`| `integration_db`| GitHub API sync, Commits, PRs, Contributor stats |
| **Notification Service**|`5006`| `notification_db`| RabbitMQ event consumer, Real-time in-app alerts |
| **RabbitMQ** | `5672` / `15672` | — | Asynchronous event broker between microservices |

---

## 📂 5. Repository Structure

```
ProjectFlow/
│
├── frontend/                     # React Client Application
│   ├── public/
│   ├── src/
│   │   ├── components/          # Reusable UI components
│   │   ├── pages/               # Student, Faculty, Admin views
│   │   └── services/            # Axios API clients
│   ├── Dockerfile
│   └── package.json
│
├── gateway/                      # Express Reverse-Proxy API Gateway
│   ├── src/
│   │   └── index.js
│   ├── Dockerfile
│   └── package.json
│
├── services/                     # Autonomous Microservices
│   ├── auth-service/            # Auth & RBAC (auth_db)
│   ├── project-service/         # Projects, Teams, Milestones (project_db)
│   ├── task-service/            # Tasks, Status, Assignments (task_db)
│   ├── evaluation-service/      # Rubrics, Marks, Feedback (evaluation_db)
│   ├── integration-service/     # GitHub REST API Sync (integration_db)
│   └── notification-service/    # RabbitMQ Event Consumer (notification_db)
│
├── docs/                         # Software Engineering Lab & Academic Deliverables
│   ├── SRS/                     # Software Requirements Specification
│   ├── UML/                     # Use Case, Sequence, Class Diagrams
│   ├── API/                     # Service-by-Service API Specifications
│   └── architecture/            # Architecture & DB Design Docs
│
├── docker-compose.yml            # Multi-service container orchestration
├── .gitignore                    # Root gitignore
└── README.md                     # Project overview & guide
```

---

## 🚀 6. Getting Started

### Prerequisites
- [Node.js (v18+)](https://nodejs.org/)
- [Docker & Docker Compose](https://www.docker.com/)
- [MongoDB](https://www.mongodb.com/) (if running services individually without Docker)
- [RabbitMQ](https://www.rabbitmq.com/)

### Quick Start with Docker Compose
To build and start all microservices, frontend, gateway, MongoDB, and RabbitMQ simultaneously:

```bash
docker-compose up --build
```

- **Frontend Client**: http://localhost:3000
- **API Gateway**: http://localhost:5000
- **RabbitMQ Management Dashboard**: http://localhost:15672 (Default: `guest` / `guest`)

---

## 🌿 7. Git Workflow & Branching Strategy

To maintain software engineering best practices:
```
main (Production / Stable Releases)
  │
  └── develop (Active Integration Branch)
        │
        ├── feature/auth-jwt
        ├── feature/project-service
        ├── feature/task-board
        ├── feature/github-sync
        └── feature/evaluation-rubrics
```

1. Never commit directly to `main` or `develop`.
2. Branch out from `develop` using `feature/<feature-name>`.
3. Open a Pull Request (PR) against `develop` for review.
4. Merge after code review and integration validation.

---

## 📅 8. Three-Month Roadmap

- **Week 1**: Requirements Gathering + SRS Document (`docs/SRS/`)
- **Week 2**: System Design, UML Diagrams, DB Schemas, API Contracts
- **Week 3**: Auth Service + API Gateway Skeleton (JWT & RBAC)
- **Week 4**: Project Service (Project & Team management)
- **Week 5**: Task Service (Kanban Task Board & Status updates)
- **Week 6**: Requirements Traceability & Milestone Submissions
- **Week 7**: Student Dashboard & Analytics
- **Week 8**: GitHub API Integration (Commits, PRs, Contributor stats)
- **Week 9**: Faculty Review Portal + Admin Management
- **Week 10**: Testing (Unit tests, API tests in Postman, Event-driven tests)
- **Week 11**: Docker Compose containerization & deployment readiness
- **Week 12**: **Feature Freeze** -> Bug fixing, Final Documentation, Academic Demo
