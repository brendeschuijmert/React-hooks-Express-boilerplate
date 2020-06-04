const mongoose = require('mongoose');
const fs = require('fs');
const config = require('../config');

const initializeMongo = () => {
  if (config.isDev) {
    mongoose.set('debug', true);
  }

  mongoose.connect(
    config.mongoURL,
    { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true },
    err => {
      if (err) {
        console.error('❌ Unable to connect mongodb');
        throw err;
      }
      // requiring models
      console.log('✅ Connected to MongoDB');
    }
  );

  const modelPath = `${__dirname}/models`;

  fs.readdirSync(modelPath).forEach(file => {
    require(`${modelPath}/${file}`); // eslint-disable-line
  });
};

module.exports = initializeMongo;
