const { generateToken } = require('../helpers/auth');
const userModel = require('../models/user.model');
const bcrypt = require('bcrypt');

module.exports.Login = async (req, res, next) => {
  try {
    const params = req.body;
    const email = params.email.toLowerCase();
    const user = await userModel.findOne({
      email
    });
    if (!user) return res.status(401).json({ error: 'Invalid email or password' });
    const passwordMatch = await bcrypt.compare(params.password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    if (!user.isEmailVerified) {
      return res.status(401).json({ error: 'Email not verified' });
    }
    const token = await generateToken(user._id);
    return res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    return next(error);
  }
};
