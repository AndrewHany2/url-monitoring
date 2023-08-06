require('dotenv').config();

const keys = {
  jwtSecret: '123dasdasfsdfjkashdfkjewr',
  jwtTokenExpiryInHours: '6',
  mongodbUrl: process.env.MONGO_URI,
  emailCredentials: {
    host: process.env.SMTP_SERVER,
    auth: process.env.SMTP_AUTH,
    password: process.env.SMTP_PASSWORD,
    port: process.env.SMTP_PORT,
    email: process.env.SMTP_EMAIL
  },
  baseUrl: process.env.BASE_URL
};
module.exports = keys;
