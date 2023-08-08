const Check = require('../models/check.model');
const Monitoring = require('../services/monitoring.service');

module.exports.CreateUrlCheck = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const cleanedUrl = req.body.url.replace(/^https:\/\//, '');
    const newCheck = await Check.create({ ...req.body, url: cleanedUrl, createdBy: userId });
    if (newCheck) { Monitoring.pingUrl(newCheck); }
    res.status(201).json(newCheck);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};
