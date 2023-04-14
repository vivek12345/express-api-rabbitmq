const notificationRouter = require('../src/routes/notificationRoutes');

const routes = function (app) {
  app.use('/api/v1/notifications', notificationRouter);
};

module.exports = routes;
