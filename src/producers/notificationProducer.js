// producer.js

const queueConnectionFactory = require('../queueConnectionFactory');
const config = require('../../config/config').queueConfig;

const QUEUES = {
  email: 'email_notifications',
  sms: 'sms_notifications',
};

async function sendNotification(type, payload) {
  try {
    const connection = await queueConnectionFactory.createConnection('rabbitmq', config);
    const channel = await connection.createChannel();
    const queueName = QUEUES[type];

    if (!queueName) {
      throw new Error('Invalid notification type');
    }

    await channel.assertQueue(queueName, { durable: false });

    const message = JSON.stringify(payload);
    channel.sendToQueue(queueName, Buffer.from(message));

    console.log('Message sent to queue:', message);
  } catch (e) {
    console.error('Error connecting to RabbitMQ:', error);
  }
}

module.exports = sendNotification;
