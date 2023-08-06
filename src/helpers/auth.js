const jwt = require('jsonwebtoken');
const keys = require('../keys');

const generateToken = (userId) => {
  return jwt.sign({ userId }, keys.jwtSecret, { expiresIn: keys.jwtTokenExpiryInHours });
};

module.exports = { generateToken };
