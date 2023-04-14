const express = require('express');

const emojis = require('./emojis');
const config = require('../../config/config');

const router = express.Router();

const { EmailSender } = require('../helper/emailSender');

const emailSender = new EmailSender({
  rabbitUrl: config.rabbitUrl,
  from: 'vivek@gmail.com',
  exchangeName: config.queueName,
});

router.get('/', async (req, res) => {
  await emailSender.sendEmail({ to: 'test@gmail.com' });
  res.json({
    message: 'API - 👋🌎🌍🌏',
  });
});

router.use('/emojis', emojis);

module.exports = router;
