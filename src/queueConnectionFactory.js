// queueConnectionFactory.js

const RabbitMQConnection = require('./rabbitMQConnection');

class QueueConnectionFactory {
  constructor() {
    if (!QueueConnectionFactory.instance) {
      this.connections = {};
      QueueConnectionFactory.instance = this;
    }

    return QueueConnectionFactory.instance;
  }

  createConnection(type, config) {
    if (!this.connections[type]) {
      if (type === 'rabbitmq') {
        this.connections[type] = new RabbitMQConnection(config);
      } else {
        throw new Error('Invalid queue type');
      }
    }
    return this.connections[type].connect();
  }
}

const queueConnectionFactory = new QueueConnectionFactory();
Object.freeze(queueConnectionFactory);

module.exports = queueConnectionFactory;
