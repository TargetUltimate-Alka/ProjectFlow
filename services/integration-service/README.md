# ProjectFlow Integration Service

Microservice responsible for GitHub repository integration, synchronizing commits, pull requests, issues, and contributor statistics.

## Configuration
- Port: `5005`
- Database: `integration_db`
- Endpoints:
  - `POST /api/integration/github/connect` - Connect repo
  - `GET /api/integration/github/:projectId/summary` - Aggregate metrics
