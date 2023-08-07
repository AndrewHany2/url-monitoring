const mongoose = require('mongoose');

const urlCheckSchema = new mongoose.Schema({
  name: { type: String, required: true },
  url: { type: String, required: true },
  protocol: { type: String, enum: ['HTTP', 'HTTPS', 'TCP'], required: true },
  path: { type: String },
  port: { type: Number },
  webhook: { type: String },
  timeout: { type: Number, default: 5 },
  interval: { type: Number, default: 600 },
  threshold: { type: Number, default: 1 },
  authentication: {
    username: { type: String },
    password: { type: String }
  },
  httpHeaders: [
    {
      key: { type: String, required: true },
      value: { type: String, required: true }
    }
  ],
  assert: {
    statusCode: { type: Number }
  },
  tags: [String],
  ignoreSSL: { type: Boolean, default: false },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

module.exports = mongoose.model('URLCheck', urlCheckSchema);
