# ProjectFlow Project Service

Microservice responsible for project creation, student teams, requirements backlog, and milestone tracking.

## Configuration
- Port: `5002`
- Database: `project_db`
- Endpoints:
  - `POST /api/projects` - Create project
  - `GET /api/projects` - List projects
  - `GET /api/projects/:id` - Get project details
  - `PUT /api/projects/:id` - Update project
