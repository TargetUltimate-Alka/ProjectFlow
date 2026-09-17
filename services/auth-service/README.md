# ProjectFlow Auth Service

Microservice responsible for authentication, user accounts, and Role-Based Access Control (RBAC).

## Configuration
- Port: `5001`
- Database: `auth_db`
- Endpoints:
  - `POST /api/auth/register` - Create user account
  - `POST /api/auth/login` - Login and get JWT token
  - `GET /api/auth/me` - Current user profile
