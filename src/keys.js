require('dotenv').config();

const keys = {
  jwtSecret: "123dasdasfsdfjkashdfkjewr",
  jwtTokenExpiryInHours: "6",
  mongodbUrl: process.env.MONGO_URI
};
module.exports = keys;