const puppeteer = require('puppeteer');
const Delivery = require('../models/Delivery');

const CONAD_PAC = {
  loginUrl: 'https://consegne.conadacasa.it/admin',
  username: 'delivery.eurecart@icarry.it',
  password: 'Icarry#PT?2021!',
  availableUrl: 'https://consegne.conadacasa.it/consegnedisponibili',
  inProgressUrl: 'https://consegne.conadacasa.it/consegneincorso',
};

const CONAD_CCN = {
  loginUrl: 'https://consegne.conadinunclick.it/admin',
  username: 'conadccn@icarry.it',
  password: 'Icarry#C?2021!',
  availableUrl: 'https://consegne.conadinunclick.it/consegnedisponibili',
  inProgressUrl: 'https://consegne.conadinunclick.it/consegneincorso',
};

async function loginAndScrape(conadConfig) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  try {
    // Login
    await page.goto(conadConfig.loginUrl, { waitUntil: 'networkidle2' });
    await page.type('input[type="email"], input[name="email"]', conadConfig.username);
    await page.type('input[type="password"], input[name="password"]', conadConfig.password);
    await Promise.all([
      page.click('button[type="submit"], input[type="submit"]'),
      page.waitForNavigation({ waitUntil: 'networkidle2' }),
    ]);

    // Scrape available deliveries
    const availableDeliveries = await scrapeDeliveries(page, conadConfig.availableUrl, 'Disponibili');

    // Scrape in-progress deliveries
    const inProgressDeliveries = await scrapeDeliveries(page, conadConfig.inProgressUrl, 'In Corso');

    await browser.close();

    return [...availableDeliveries, ...inProgressDeliveries];
  } catch (error) {
    await browser.close();
    throw error;
  }
}

async function scrapeDeliveries(page, url, status) {
  await page.goto(url, { waitUntil: 'networkidle2' });

  // TODO: Adjust selectors based on actual page structure
  // For now, assume deliveries are in a table or list with identifiable selectors

  const deliveries = await page.evaluate((status) => {
    // Example scraping logic - to be customized
    const rows = Array.from(document.querySelectorAll('table tr, .delivery-item'));
    return rows.map(row => {
      // Extract delivery info from row elements
      const deliveryId = row.querySelector('.delivery-id')?.innerText || '';
      const driver = row.querySelector('.driver-name')?.innerText || '';
      const store = row.querySelector('.store-name')?.innerText || '';
      const timestamp = new Date().toISOString();

      return {
        deliveryId,
        driver,
        store,
        status,
        timestamp,
        details: {},
      };
    }).filter(d => d.deliveryId);
  }, status);

  // Save or update deliveries in DB
  for (const delivery of deliveries) {
    await Delivery.findOneAndUpdate(
      { deliveryId: delivery.deliveryId },
      delivery,
      { upsert: true, new: true }
    );
  }

  return deliveries;
}

module.exports = {
  loginAndScrape,
  CONAD_PAC,
  CONAD_CCN,
};
