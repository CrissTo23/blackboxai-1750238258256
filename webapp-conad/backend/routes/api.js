const express = require('express');
const router = express.Router();
const Delivery = require('../models/Delivery');
const Alert = require('../models/Alert');

// GET /api/deliveries?status=&driver=&store=
router.get('/deliveries', async (req, res) => {
  try {
    const { status, driver, store } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (driver) filter.driver = driver;
    if (store) filter.store = store;

    const deliveries = await Delivery.find(filter).sort({ timestamp: -1 });
    res.json(deliveries);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/alerts
router.get('/alerts', async (req, res) => {
  try {
    const alerts = await Alert.find({ resolved: false }).sort({ timestamp: -1 });
    res.json(alerts);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
