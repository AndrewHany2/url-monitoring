const generateToken = (userId) => {
    return jwt.sign({ userId }, keys.jwtSecret, { expiresIn: keys.jwtTokenExpiryInHours });
};

module.exports = { generateToken }