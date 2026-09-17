# ProjectFlow Task Service

Microservice responsible for tasks, assignments, Kanban board columns, and sprint progress. Publishes events to RabbitMQ.

## Configuration
- Port: `5003`
- Database: `task_db`
- Endpoints:
  - `POST /api/tasks` - Create and assign task
  - `GET /api/tasks/project/:projectId` - Get project tasks
  - `PUT /api/tasks/:id/status` - Move task between Kanban columns
