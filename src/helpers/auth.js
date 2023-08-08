const jwt = require('jsonwebtoken');
const keys = require('../keys');

const generateToken = (userId) => {
  return jwt.sign({ userId }, keys.jwtSecret, { expiresIn: `${keys.jwtTokenExpiryInHours}h` });
};

module.exports = { generateToken };
