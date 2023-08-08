const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userId: { type: String, ref: 'User', required: true },
  token: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Token', userSchema);
