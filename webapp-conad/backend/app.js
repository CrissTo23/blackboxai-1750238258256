const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch((err) => console.error('MongoDB connection error:', err));

const { scrapeAndAnalyze } = require('./cron/scrapeCron');

// Basic route
app.get('/', (req, res) => {
  res.send('Conad Delivery Monitoring Backend is running');
});

const apiRoutes = require('./routes/api');
app.use('/api', apiRoutes);

// Start cronjob
scrapeAndAnalyze(); // Run once at startup

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
