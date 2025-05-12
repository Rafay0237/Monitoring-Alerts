const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  projectName: { type: String, required: true },
  email: { type: String, required: true },
  count: { type: Number, default: 0 },
  key: { type: String, required: true }, 
  limit: { type: Number, default: 10 }, 
}, { timestamps: true });

module.exports = mongoose.model('Alert', alertSchema);
