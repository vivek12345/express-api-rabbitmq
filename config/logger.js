const pino = require('pino');
const config = require('./config');

const logger = pino({
  level: config.env === 'development' ? 'debug' : 'info',
  formatters: {
    level: (label) => ({ level: label }),
  },
  serializers: {
    err: pino.stdSerializers.err,
  },
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: config.env === 'development',
    },
  },
});

exports.logger = logger;
