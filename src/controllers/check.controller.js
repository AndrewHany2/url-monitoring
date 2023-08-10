const Check = require('../models/check.model');
const { monitor } = require('../cron');

module.exports.CreateUrlCheck = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const cleanedUrl = req.body.url.replace(/^(https?|http):\/\//, '');
    const newCheck = await Check.create({ ...req.body, url: cleanedUrl, createdBy: userId });
    if (newCheck) {
      monitor.scheduleTask(newCheck, null, true);
    }
    res.status(201).json(newCheck);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports.UpdateUrlCheck = async (req, res, next) => {
  try {
    const { url } = req.body;
    if (url) {
      req.body.url = req.body.url.replace(/^(https?|http):\/\//, '');
    }
    const urlCheckId = req.params.id;
    const newCheck = await Check.updateOne({ _id: urlCheckId }, {
      $set: {
        ...req.body
      }
    });
    if (newCheck && newCheck.modifiedCount === 1) {
      monitor.rescheduleTask({ ...req.body, _id: urlCheckId });
    }
    res.status(201).json(newCheck);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};
