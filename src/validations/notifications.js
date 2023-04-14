const Joi = require('joi');

const notificationSchema = Joi.object({
  type: Joi.string().valid('email', 'sms').required(),
  recipient: Joi.string().required(),
  subject: Joi.when('type', {
    is: 'email',
    then: Joi.string().required(),
  }),
  content: Joi.string().required(),
});

module.exports = {
  notificationSchema,
};
