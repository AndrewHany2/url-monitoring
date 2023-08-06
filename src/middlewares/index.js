const mongoose = require('mongoose');
const keys = require('../keys');
const jwt = require('jsonwebtoken');
const userModel = require('../models/user.model');

const authMiddleware = async (req, res, next) => {
  try {
    const err = new Error();
    err.statusCode = 403;
    if (!req.headers.authorization) {
      err.message = 'Not authorized to access without token';
      return next(err);
    }
    const token = req.headers.authorization;
    const tokenCheck = jwt.verify(token, keys.jwtSecret);
    if (!tokenCheck) {
      err.message = 'Invalid token';
      return next(err);
    }
    const user = await userModel.findOne({
      _id: new mongoose.Types.ObjectId(tokenCheck.id)
    });
    if (!user) {
      err.message = 'Invalid token user';
      return next(err);
    }
    req.user = user;
    req.user.id = user._id;
    next();
  } catch (error) {
    return next(error);
  }
};

const validationMiddleware = (validationObject, isGet) => (req, res, next) => {
  const body = isGet ? req.query : req.body;
  const { error } = validationObject.validate(body);
  if (error) {
    error.statusCode = 422;
    error.message =
      error.message || 'Parameters missing or Invalid values passed...!';
    return next(error);
  }
  return next();
};

const ErrorHandler = (err, req, res, next) => {
  const errStatus = err.statusCode || 500;
  const errMsg = err.message || 'Something went wrong';
  res.status(errStatus).json({
    success: false,
    status: errStatus,
    message: errMsg
  });
};

module.exports = {
  authMiddleware,
  validationMiddleware,
  ErrorHandler
};
