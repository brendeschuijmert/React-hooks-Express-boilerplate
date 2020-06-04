const dotenv = require('dotenv');

const isDev = process.env.NODE_ENV !== 'production';

if (isDev) {
  try {
    dotenv.config();
  } catch (e) {
    console.error(e);
  }
}

module.exports = {
  host: process.env.HOST || 'https://localhost',
  port: parseInt(process.env.PORT, 10) || 4000,
  isDev,
  mongoURL: process.env.MONGODB_URI || 'mongodb://localhost:27017/toptal-test',
  uploadLimit: process.env.UPLOAD_LIMIT || '10mb',
  jwtSecret: process.env.JWT_SECRET || 'dreamhigh',
  jwtExpiresIn: process.env.JWT_EXPIRES || '30d'
};
