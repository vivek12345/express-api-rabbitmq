const Joi = require('joi');

require('dotenv').config();

const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string().valid('production', 'development', 'test').required(),
    PORT: Joi.number().default(5000),
    RABBIT_URL: Joi.string().required(),
    QUEUE_NAME: Joi.string().default('email-notification'),
    QUEUE_CONFIG: Joi.object({
      connectionUrls: Joi.string().required(),
      // ... (other configuration)
    }),
  })
  .unknown();

const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

module.exports = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  rabbitUrl: envVars.RABBIT_URL,
  queueName: envVars.QUEUE_NAME,
  queueConfig: {
    connectionUrls: envVars.RABBIT_URL,
  },
};
