require('dotenv').config();
const { Buffer } = require('buffer');
const decodedPassword = Buffer.from(process.env.SMTP_PASSWORD, 'base64').toString('utf-8');

const keys = {
  jwtSecret: '123dasdasfsdfjkashdfkjewr',
  jwtTokenExpiryInHours: '6',
  mongodbUrl: process.env.MONGO_URI,
  emailCredentials: {
    host: process.env.SMTP_SERVER,
    auth: process.env.SMTP_AUTH,
    password: decodedPassword,
    port: process.env.SMTP_PORT,
    email: process.env.SMTP_EMAIL
  },
  baseUrl: process.env.BASE_URL
};
module.exports = keys;
