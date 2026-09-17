# ProjectFlow API Gateway

Central reverse proxy for the ProjectFlow microservices architecture. Routes client traffic from `http://localhost:5000/api/*` to the appropriate downstream service.

## Ports & Endpoints
- Port: `5000`
- Health check: `GET http://localhost:5000/health`
- Route rules:
  - `/api/auth/*` -> Auth Service (`:5001`)
  - `/api/projects/*` -> Project Service (`:5002`)
  - `/api/tasks/*` -> Task Service (`:5003`)
  - `/api/evaluations/*` -> Evaluation Service (`:5004`)
  - `/api/integration/*` -> Integration Service (`:5005`)
  - `/api/notifications/*` -> Notification Service (`:5006`)
