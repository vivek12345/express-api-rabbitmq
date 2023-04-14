// rabbitMQConnection.js

const amqp = require('amqplib');
const QueueConnection = require('./queueConnection');

class RabbitMQConnection extends QueueConnection {
  constructor(config) {
    super();
    this.config = config;
    this.connection = null;
  }
  async connect() {
    if (this.connection) {
      return this.connection;
    }
    this.connection = await new Promise((resolve, reject) => {
      amqp.connect(this.config.connectionUrl, (error, conn) => {
        if (error) {
          console.error('Error connecting to RabbitMQ instance:', error);
          return reject(error);
        }
        resolve(conn);
      });
    });

    return this.connection;
  }
}

module.exports = RabbitMQConnection;
