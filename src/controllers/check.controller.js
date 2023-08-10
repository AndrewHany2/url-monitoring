const Check = require('../models/check.model');
const { monitor } = require('../cron');
const { default: mongoose } = require('mongoose');

module.exports.GetAllUrlCheck = async (req, res, next) => {
  try {
    const urlChecks = await Check.find({ createdBy: new mongoose.Types.ObjectId(req.user.id) });
    res.status(201).json(urlChecks);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports.GetUrlCheck = async (req, res, next) => {
  try {
    const urlCheck = await Check.findOne({
      _id: new mongoose.Types.ObjectId(req.params.id),
      createdBy: new mongoose.Types.ObjectId(req.user.id)
    });
    res.status(201).json(urlCheck);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

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

module.exports.DeleteUrlCheck = async (req, res, next) => {
  try {
    const urlCheckId = req.params.id;
    const deleted = monitor.deleteTask(urlCheckId);
    if (!deleted) res.status(500).json({ error: 'Couldnt delete the url check' });
    await Check.deleteOne({ _id: urlCheckId });
    res.status(201).json('succesfully deleted');
    res.status(201);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};
