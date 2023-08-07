const Check = require('../models/check.model');

module.exports.CreateUrlCheck = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const newCheck = new Check({ ...req.body, createdBy: userId });
    await newCheck.save();
    res.status(201).json(newCheck);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};
