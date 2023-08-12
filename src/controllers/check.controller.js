const Check = require('../models/check.model');
const { monitor } = require('../cron');
const { default: mongoose } = require('mongoose');

module.exports.GetAllUrlCheck = async (req, res, next) => {
  try {
    const { tags } = req.query;
    const filter = {};
    if (tags) {
      const tagsArray = tags.split(',');
      if (tagsArray && tagsArray.length > 0) {
        filter.tags = { $in: tagsArray };
      }
    }
    filter.createdBy = new mongoose.Types.ObjectId(req.user.id);
    const urlChecks = await Check.find({ ...filter });
    return res.status(201).json(urlChecks);
  } catch (error) {
    return next(error);
  }
};

module.exports.GetUrlCheck = async (req, res, next) => {
  try {
    const urlCheck = await Check.findOne({
      _id: new mongoose.Types.ObjectId(req.params.id),
      createdBy: new mongoose.Types.ObjectId(req.user.id)
    });
    return res.status(201).json(urlCheck);
  } catch (error) {
    return next(error);
  }
};

module.exports.CreateUrlCheck = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const cleanedUrl = req.body.url.replace(/^(https?|http):\/\//, '');
    let path;
    if (req.body.path) {
      path = req.body.path.startsWith('/') ? req.body.path.slice(1) : req.body.path;
    }
    const newCheck = await Check.create({ ...req.body, url: cleanedUrl, createdBy: userId, path });
    if (newCheck) {
      monitor.scheduleTask({ urlCheck: newCheck, task: null, isNew: true });
    }
    return res.status(201).json(newCheck);
  } catch (error) {
    return next(error);
  }
};

module.exports.UpdateUrlCheck = async (req, res, next) => {
  try {
    const { url, path } = req.body;
    if (url) {
      req.body.url = req.body.url.replace(/^(https?|http):\/\//, '');
    }
    if (path) {
      req.body.path = req.body.path.startsWith('/') ? req.body.path.slice(1) : req.body.path;
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
    return res.status(201).json(newCheck);
  } catch (error) {
    return next(error);
  }
};

module.exports.DeleteUrlCheck = async (req, res, next) => {
  try {
    const urlCheckId = req.params.id;
    const deleted = monitor.deleteTask(urlCheckId);
    if (!deleted) res.status(500).json({ error: 'Couldnt delete the url check' });
    await Check.deleteOne({ _id: urlCheckId });
    return res.status(201).json('succesfully deleted');
  } catch (error) {
    return next(error);
  }
};
