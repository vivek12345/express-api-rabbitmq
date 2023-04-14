const app = require('./app');
const config = require('../config/config');
const { logger } = require('../config/logger');
const { startConsumer } = require('./consumer');
const { QUEUES } = require('./constants/queues');

const { port } = config;
let server;

const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info('Server closed');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error) => {
  logger.error(error);
  exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
  logger.info('SIGTERM received');
  if (server) {
    server.close();
  }
});

server = app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log({ port });
  startConsumer(QUEUES.email);
  /* eslint-disable no-console */
  logger.info(`Listening to port ${config.port}`);
  /* eslint-enable no-console */
});
