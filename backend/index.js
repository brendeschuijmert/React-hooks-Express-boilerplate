const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const compression = require('compression');
const cors = require('cors');
const morgan = require('morgan');
const config = require('./config');
const APIError = require('./api/utils/api-error');

const initializeDB = require('./api/mongoose');

// initialize db on the top to have models available below
initializeDB();

const initializePassport = require('./api/passport');
const { apiRouter } = require('./api');

const app = express();
app.use(morgan('combined'));
app.use(helmet({ frameguard: false }));
app.use(compression());
app.use(
  bodyParser.json({
    limit: config.uploadLimit
  })
);
app.use(
  bodyParser.urlencoded({
    limit: config.uploadLimit,
    extended: false
  })
);

app.use(cors());

initializePassport(app);

app.use('/', apiRouter);

app.use((req, res, next) => {
  next(new APIError('API not found', 404));
});

// default error handler
// eslint-disable-next-line
app.use((err, req, res, next1) => {
  console.error(err);
  res.status(err.status || 500).json({
    message: err.message,
    stack: config.isDev ? err.stack : undefined
  });
});

app.listen(config.port, err => {
  if (err) throw err;

  console.log(`> ✌ Ready on ${config.host}:${config.port}`);
});
