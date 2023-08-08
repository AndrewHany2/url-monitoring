const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  urlCheck: { type: mongoose.Schema.Types.ObjectId, ref: 'URLCheck', required: true },
  status: { type: String, enum: ['UP', 'DOWN'], required: true },
  responseTime: { type: Number, required: true },
  availability: { type: Number, required: true },
  outages: { type: Number, required: true },
  downtime: { type: Number, required: true },
  uptime: { type: Number, required: true },
  history: [
    {
      timestamp: { type: Date, default: Date.now },
      status: { type: String, enum: ['UP', 'DOWN'], required: true },
      responseTime: { type: Number, required: true }
    }
  ]
}, { timestamp: true });

module.exports = mongoose.model('Report', reportSchema);
