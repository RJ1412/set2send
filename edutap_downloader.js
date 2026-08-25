const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
const os = require('os');

(async () => {
  // 1. Setup the download directory on the Desktop
  const desktopDir = path.join(os.homedir(), 'Desktop');
  const downloadDir = path.join(desktopDir, 'rbi');
  if (!fs.existsSync(downloadDir)) fs.mkdirSync(downloadDir, { recursive: true });

  console.log('Connecting to your already-open Chrome...');

  let browser;
  try {
    // Connect to the Chrome instance that was opened with the debugging port
    browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
  } catch (error) {
    console.error('\nERROR: Could not connect to Chrome.');
    console.error('Make sure you launched Chrome using the exact command I provided in the chat!');
    process.exit(1);
  }

  // Get the active tab
  const defaultContext = browser.contexts()[0];
  const page = defaultContext.pages().length > 0 ? defaultContext.pages()[0] : await defaultContext.newPage();

  // 3. Navigate to the EduTap course link
  const url = 'https://courses.edutap.co.in/learn/home/RBI-SEBI--Ph-1-Full-Video---Ph-2-Full-Video/Finance---Management-New---RBI-Grade-A-B/section/0/lesson/0';
  console.log(`Navigating to ${url}...`);
  await page.goto(url, { waitUntil: 'load', timeout: 60000 });

  // Wait 10 seconds to make absolutely sure the UI has loaded and you are fully logged in
  console.log('Waiting 10 seconds for the course player to fully load...');
  await page.waitForTimeout(10000);

  // 4. Save the HTML of the page so I can see exactly what EduTap's hidden code looks like
  const html = await page.content();
  fs.writeFileSync('edutap_page.html', html);
  console.log('Saved page HTML to "edutap_page.html"!');

  // 5. Try a few generic selectors again just in case
  let chapters = await page.locator('a[href*="lesson"]').all();
  if (chapters.length === 0) {
     chapters = await page.locator('.chapter, .lesson, .section, .MuiListItem-root, li').all();
  }

  console.log(`Found ${chapters.length} potential chapters.`);
  if (chapters.length > 0) {
      console.log('I will stop here for now. Please reply to the chat so the AI can read the edutap_page.html file!');
  } else {
      console.log('Could not find any chapters automatically. Please reply to the chat!');
  }

  console.log('\nDisconnecting from Chrome...');
  await browser.close();
})();
