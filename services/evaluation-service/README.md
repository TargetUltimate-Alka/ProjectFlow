# ProjectFlow Evaluation Service

Microservice responsible for project evaluation rubrics, marks allocation, and faculty feedback.

## Configuration
- Port: `5004`
- Database: `evaluation_db`
- Endpoints:
  - `POST /api/evaluations` - Submit marks and feedback for a milestone
  - `GET /api/evaluations/project/:projectId` - Retrieve evaluations for a project
