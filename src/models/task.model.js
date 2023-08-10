const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  urlCheckId: { type: mongoose.Schema.Types.ObjectId, ref: 'URLCheck', required: true },
  taskId: { type: String, required: true, unique: true },
  interval: { type: Number, required: true },
  isActive: { type: Boolean, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Task', TaskSchema);
