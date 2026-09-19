const amqp = require('amqplib');
const { EventEmitter } = require('events');

// Global in-process event emitter fallback for when standalone RabbitMQ is offline
if (!global.__projectFlowEventHub) {
  global.__projectFlowEventHub = new EventEmitter();
  global.__projectFlowEventHub.setMaxListeners(100);
}

const EXCHANGE_NAME = 'projectflow_events';

class EventBus {
  constructor(serviceName) {
    this.serviceName = serviceName;
    this.connection = null;
    this.channel = null;
    this.useRabbitMQ = false;
    this.subscriptions = [];
  }

  async init() {
    const rabbitUrl = process.env.RABBITMQ_URL || 'amqp://localhost:5672';
    try {
      this.connection = await amqp.connect(rabbitUrl);
      this.channel = await this.connection.createChannel();
      await this.channel.assertExchange(EXCHANGE_NAME, 'topic', { durable: true });
      this.useRabbitMQ = true;
      console.log(`[${this.serviceName}] EventBus connected to RabbitMQ broker at ${rabbitUrl}`);

      this.connection.on('error', (err) => {
        console.warn(`[${this.serviceName}] RabbitMQ connection error: ${err.message}`);
        this.useRabbitMQ = false;
      });
      this.connection.on('close', () => {
        console.warn(`[${this.serviceName}] RabbitMQ connection closed. Reverting to internal event hub.`);
        this.useRabbitMQ = false;
      });
    } catch (err) {
      this.useRabbitMQ = false;
      console.log(`[${this.serviceName}] RabbitMQ broker offline (${err.message}). Using resilient local event bus.`);
    }
  }

  async publish(eventType, payload) {
    const event = {
      eventId: Math.random().toString(36).substring(2, 12),
      eventType,
      sourceService: this.serviceName,
      timestamp: new Date().toISOString(),
      payload
    };

    if (this.useRabbitMQ && this.channel) {
      try {
        const messageBuffer = Buffer.from(JSON.stringify(event));
        this.channel.publish(EXCHANGE_NAME, eventType, messageBuffer, { persistent: true });
        console.log(`[${this.serviceName}] Published [RabbitMQ] event: ${eventType}`);
      } catch (err) {
        console.error(`[${this.serviceName}] RabbitMQ publish failed, falling back to local bus: ${err.message}`);
        global.__projectFlowEventHub.emit(eventType, event);
      }
    } else {
      global.__projectFlowEventHub.emit(eventType, event);
      console.log(`[${this.serviceName}] Published [LocalBus] event: ${eventType}`);
    }
  }

  async subscribe(pattern, handler) {
    if (this.useRabbitMQ && this.channel) {
      try {
        const queueName = `q_${this.serviceName}_${pattern.replace(/\*/g, 'all').replace(/#/g, 'any')}`;
        const q = await this.channel.assertQueue(queueName, { durable: true });
        await this.channel.bindQueue(q.queue, EXCHANGE_NAME, pattern);
        this.channel.consume(q.queue, async (msg) => {
          if (msg !== null) {
            try {
              const event = JSON.parse(msg.content.toString());
              await handler(event);
              this.channel.ack(msg);
            } catch (handleErr) {
              console.error(`[${this.serviceName}] Error handling event ${pattern}:`, handleErr);
              this.channel.nack(msg, false, false);
            }
          }
        });
        console.log(`[${this.serviceName}] Subscribed to RabbitMQ topic: ${pattern}`);
      } catch (err) {
        console.warn(`[${this.serviceName}] RabbitMQ subscribe failed, attaching to local bus:`, err.message);
        global.__projectFlowEventHub.on(pattern, handler);
      }
    } else {
      global.__projectFlowEventHub.on(pattern, handler);
      console.log(`[${this.serviceName}] Subscribed to local event bus topic: ${pattern}`);
    }
  }
}

async function createEventBus(serviceName) {
  const bus = new EventBus(serviceName);
  await bus.init();
  return bus;
}

module.exports = { createEventBus };
