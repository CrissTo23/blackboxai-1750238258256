const cron = require('node-cron');
const { loginAndScrape, CONAD_PAC, CONAD_CCN } = require('../services/scraper');
const Alert = require('../models/Alert');
const Delivery = require('../models/Delivery');

async function analyzeAlerts() {
  // Example alert: drivers with more than 4 deliveries
  const pipeline = [
    {
      $group: {
        _id: "$driver",
        count: { $sum: 1 }
      }
    },
    {
      $match: {
        count: { $gt: 4 }
      }
    }
  ];

  const results = await Delivery.aggregate(pipeline);

  // Clear old alerts of this type
  await Alert.deleteMany({ alertType: 'Driver Overload' });

  for (const res of results) {
    const alert = new Alert({
      alertType: 'Driver Overload',
      message: `Driver ${res._id} has ${res.count} deliveries.`,
      relatedDriver: res._id,
      deliveryCount: res.count,
    });
    await alert.save();
  }
}

async function scrapeAndAnalyze() {
  try {
    console.log('Starting scraping job...');
    const pacDeliveries = await loginAndScrape(CONAD_PAC);
    const ccnDeliveries = await loginAndScrape(CONAD_CCN);

    console.log(`Scraped ${pacDeliveries.length} PAC deliveries and ${ccnDeliveries.length} CCN deliveries.`);

    await analyzeAlerts();

    console.log('Scraping and analysis completed.');
  } catch (error) {
    console.error('Error during scraping and analysis:', error);
  }
}

// Schedule cronjob every 5 minutes
cron.schedule('*/5 * * * *', () => {
  scrapeAndAnalyze();
  console.log('Scheduled scraping job triggered.');
});

module.exports = {
  scrapeAndAnalyze,
};
