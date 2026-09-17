# ProjectFlow Notification Service

Event-driven microservice that listens to RabbitMQ exchanges/queues for lifecycle events (`TASK_CREATED`, `MILESTONE_SUBMITTED`, `EVALUATION_COMPLETED`) and persists notifications for users.

## Configuration
- Port: `5006`
- Database: `notification_db`
- Message Broker: RabbitMQ (`amqp://guest:guest@localhost:5672`)
- Endpoints:
  - `GET /api/notifications` - Retrieve in-app notifications
  - `PUT /api/notifications/:id/read` - Mark notification as read
