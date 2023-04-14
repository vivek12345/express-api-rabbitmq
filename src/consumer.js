// consumer.js

const queueConnectionFactory = require('./queueConnectionFactory');
const config = require('../config/config').queueConfig;
const sendEmail = require('./helper/sendGridHelper');
const { updateNotificationStatus } = require('./database/db');

const QUEUES = {
  email: 'email_notifications',
  sms: 'sms_notifications',
};

const DEAD_LETTER_EXCHANGES = {
  email: 'email_notifications_dead_letter',
  sms: 'sms_notifications_dead_letter',
};

async function startConsumer(queueName) {
  try {
    const connection = await queueConnectionFactory.createConnection('rabbitmq', config);
    const channel = await connection.createChannel();

    // Configure the dead-letter exchange and queue
    const deadLetterExchange = DEAD_LETTER_EXCHANGES[queueName];
    await channel.assertExchange(deadLetterExchange, 'fanout', { durable: false });
    const deadLetterQueue = `${queueName}_dead_letter`;
    await channel.assertQueue(deadLetterQueue, { durable: false });
    await channel.bindQueue(deadLetterQueue, deadLetterExchange, '');

    // Configure the main queue with the dead-letter exchange
    await channel.assertQueue(queueName, {
      durable: false,
      deadLetterExchange,
    });

    console.log('Waiting for messages in queue:', queueName);

    channel.consume(queueName, async (msg) => {
      const { id, to, subject, text } = JSON.parse(msg.content.toString());

      if (queueName === QUEUES.email) {
        await sendEmail(to, subject, text, (error, result) => {
          if (error) {
            console.error('Failed to send email:', error);

            // Send the message to the dead-letter exchange
            channel.publish(deadLetterExchange, '', msg.content);
            channel.ack(msg);
          } else {
            updateNotificationStatus(id, 'sent');
            channel.ack(msg);
          }
        });
      }

      // Add SMS handling here, similar to the email handling above
    });
  } catch (error) {
    console.error('Error connecting to RabbitMQ:', error);
  }
}

// Start consumers for both email and SMS queue

module.exports = {
  startConsumer,
};
