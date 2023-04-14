const amqp = require('amqp-connection-manager');
const { logger } = require('../../config/logger');

class EmailSender {
  constructor({ from, rabbitUrl, exchangeName }) {
    this.from = from;
    this.connectionManager = amqp.connect(rabbitUrl);
    this.exchangeName = exchangeName;
  }

  async sendEmail(email) {
    try {
      const channelWrapper = await this.connectionManager.createChannel({
        json: true,
        setup: (channel) => channel.assertQueue(this.exchangeName, { durable: false }),
      });

      await channelWrapper.assertExchange(this.exchangeName, 'fanout', { durable: false });
      const message = JSON.stringify(email);
      channelWrapper.publish(this.exchangeName, '', Buffer.from(message));

      logger.info(`Email published to ${email.to}`);
    } catch (error) {
      logger.error(`Error sending email: ${error.message}`);
    }
  }
}

module.exports = {
  EmailSender,
};
