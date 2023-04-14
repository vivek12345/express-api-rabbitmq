const express = require('express');
const helmet = require('helmet');
const cors = require('cors');

const morgan = require('../config/morgan');
const config = require('../config/config');
const routes = require('../config/router');

const middlewares = require('./middlewares');
const api = require('./api');

const app = express();

if (config.env !== 'test') {
  app.use(morgan.successHandler);
  app.use(morgan.errorHandler);
}
app.use(helmet());
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    message: '🦄🌈✨👋🌎🌍🌏✨🌈🦄',
  });
});

routes(app);

app.use('/api/v1', api);

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

module.exports = app;
