const mongoose = require('mongoose');

const AlertSchema = new mongoose.Schema({
  alertType: { type: String, required: true },
  message: { type: String, required: true },
  relatedDriver: { type: String },
  relatedStore: { type: String },
  deliveryCount: { type: Number },
  timestamp: { type: Date, default: Date.now },
  resolved: { type: Boolean, default: false },
});

module.exports = mongoose.model('Alert', AlertSchema);
