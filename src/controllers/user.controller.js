const bcrypt = require('bcrypt');
const crypto = require('crypto');
const userModel = require('../models/user.model');
const NotificationService = require('../services/notification.service');
const keys = require('../keys');
const tokenModel = require('../models/token.model');

async function Register (req, res, next) {
  try {
    const params = req.body;
    const email = params.email.toLowerCase();
    const existingUser = await userModel.findOne({ email });
    if (existingUser) return res.status(409).json({ error: 'Email already exists' });
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(params.password, salt);
    const userCheck = await userModel.create({
      email,
      firstName: params.firstName,
      lastName: params.lastName,
      password: hashedPassword
    });
    if (!userCheck) return res.status(500).json({ error: 'Cannot make user' });
    const token = await tokenModel.create({
      userId: userCheck._id,
      token: crypto.randomBytes(32).toString('hex')
    });
    const message = `${keys.baseUrl}/api/user/verify?id=${userCheck._id}&token=${token.token}`;
    await NotificationService.Send(userCheck.email, 'Verify Email', message);
    return res.status(201).json('Account created, please verify your email');
  } catch (error) {
    next(error);
  }
}

async function VerifyEmail (req, res, next) {
  try {
    const user = await userModel.findOne({ _id: req.query.id });
    if (!user) return res.status(400).send('Invalid link');

    const token = await tokenModel.findOne({
      userId: user._id,
      token: req.query.token
    });
    if (!token) return res.status(400).send('Invalid link');
    if (token.userId !== user._id.toString()) return res.status(400).send('Invalid link');

    await userModel.updateOne({ _id: user._id }, { isEmailVerified: true });
    await tokenModel.deleteOne({ _id: token._id });
    return res.status(200).json('Email Verified');
  } catch (error) {
    res.status(400).send('An error occured');
  }
}
module.exports = {
  Register,
  VerifyEmail
};
