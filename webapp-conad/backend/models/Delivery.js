const mongoose = require('mongoose');

const DeliverySchema = new mongoose.Schema({
  deliveryId: { type: String, required: true, unique: true },
  driver: { type: String, required: true },
  store: { type: String, required: true },
  status: { type: String, enum: ['Disponibili', 'In Corso'], required: true },
  timestamp: { type: Date, default: Date.now },
  details: { type: Object }, // Additional delivery details
});

module.exports = mongoose.model('Delivery', DeliverySchema);
