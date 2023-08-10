const { default: mongoose } = require('mongoose');
const reportModel = require('../models/report.model');

module.exports.getReports = async (req, res, next) => {
  try {
    // get url checks by tags
    const { tags } = req.query;
    const filter = {};
    if (tags) {
      const tagsArray = tags.split(',');
      if (tagsArray && tagsArray.length > 0) {
        filter['urlcheck.tags'] = { $in: tagsArray };
      }
    }
    filter.createdBy = new mongoose.Types.ObjectId(req.user.id);
    const report = await reportModel.aggregate([
      {
        $lookup:
            {
              from: 'urlchecks',
              localField: 'urlCheck',
              foreignField: '_id',
              as: 'urlcheck'
            }
      },
      {
        $unwind:
            {
              path: '$urlcheck',
              includeArrayIndex: 'string',
              preserveNullAndEmptyArrays: false
            }
      },
      {
        $match: { ...filter }
      },
      {
        $project:
          {
            _id: 0,
            status: 1,
            responseTime: 1,
            availability: 1,
            outages: 1,
            downtime: 1,
            uptime: 1,
            history: 1
          }
      }
    ]);
    return res.status(200).json(report);
  } catch (error) {
    return next(error);
  }
};
