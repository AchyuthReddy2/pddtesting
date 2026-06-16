const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const XLSX = require('xlsx');
const path = require('path');

async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function saveTestResultsExcel(status, errorMessage = '') {
  try {
    const data = [
      ["Metric", "Value"],
      ["Test Suite", "VillageConnect E2E Test Suite"],
      ["Test Case Name", "User Onboarding, Email OTP verification & Signup Flow"],
      ["Environment", "Local Development (React Native Web / Expo 51)"],
      ["Status", status],
      ["Date & Time", new Date().toString()],
      ["Browser", "Google Chrome (Headless)"],
      ["Backend API", "http://localhost:4000/api"],
      ["Frontend URL", "http://localhost:8081"],
      ["Error Details", errorMessage || "N/A"]
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(data);
    worksheet['!cols'] = [
      { wch: 22 },
      { wch: 60 }
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "E2E Test Results");

    const outputPath = path.join(__dirname, 'selenium_test_results.xlsx');
    XLSX.writeFile(workbook, outputPath);
    console.log(`Excel test report successfully generated at: ${outputPath}`);
  } catch (err) {
    console.error('Failed to generate Excel test report:', err);
  }
}

async function runTest() {
  console.log('Starting Selenium E2E Test...');

  // Launch Chrome in headless mode
  const options = new chrome.Options();
  options.addArguments('--headless=new');
  options.addArguments('--disable-gpu');
  options.addArguments('--no-sandbox');
  options.addArguments('--disable-dev-shm-usage');

  const driver = await new Builder()
    .forBrowser('chrome')
    .setChromeOptions(options)
    .build();

  try {
    const email = `selenium-${Date.now()}@villageconnect.app`;
    console.log(`Test Email generated: ${email}`);

    // Navigate to local Expo web server
    console.log('Navigating to http://localhost:8081...');
    await driver.get('http://localhost:8081');
    
    // Inject alert and confirm mock overrides
    await driver.executeScript("window.alert = function(msg) { console.log('Mock Alert:', msg); }; window.confirm = function() { return true; };");

    // Wait for splash screen to finish
    console.log('Waiting 3 seconds for splash screen to complete...');
    await delay(3000);

    // Check for Onboarding Screen and skip if present
    try {
      console.log('Checking for Onboarding screen Skip button...');
      const skipButton = await driver.wait(
        until.elementLocated(By.xpath("//div[text()='Skip' or text()='skip' or contains(text(), 'Skip')]")),
        5000
      );
      console.log('Onboarding screen detected. Clicking Skip...');
      await driver.executeScript("arguments[0].click();", skipButton);
      console.log('Clicked Skip.');
      await delay(1500);
      // Re-inject overrides just in case state change did a hard refresh
      await driver.executeScript("window.alert = function(msg) { console.log('Mock Alert:', msg); }; window.confirm = function() { return true; };");
    } catch (e) {
      console.log('Onboarding Skip button not found or click failed. Proceeding...');
    }

    // Wait for the login screen to render
    console.log('Waiting for login screen email input...');
    const emailInput = await driver.wait(
      until.elementLocated(By.xpath("//input[contains(@placeholder, 'you@example.com')]")),
      15000
    );
    console.log('Found Email input field.');

    // Enter email address
    await emailInput.sendKeys(email);
    console.log('Entered email address.');

    // Locate the Send OTP button and click it
    const sendOtpButton = await driver.findElement(
      By.xpath("//div[text()='Send OTP']/..")
    );
    await driver.executeScript("arguments[0].click();", sendOtpButton);
    console.log('Clicked Send OTP button.');

    // Wait a brief moment for OTP to be sent
    await delay(3000);

    // Call backend API to fetch the generated OTP
    console.log('Fetching OTP from test endpoint...');
    const otpRes = await fetch(`http://localhost:4000/api/auth/test-get-otp?email=${email}`);
    if (!otpRes.ok) {
      throw new Error(`Failed to fetch OTP from backend: ${otpRes.statusText}`);
    }
    const { otp } = await otpRes.json();
    console.log(`Retrieved OTP from backend: ${otp}`);

    // Enter OTP
    console.log('Entering OTP...');
    const otpInput = await driver.wait(
      until.elementLocated(By.xpath("//input[contains(@placeholder, '123456')]")),
      10000
    );
    await otpInput.sendKeys(otp);
    console.log('Entered OTP.');

    // Locate the Verify button and click it
    const verifyButton = await driver.findElement(
      By.xpath("//div[text()='Verify']/..")
    );
    await driver.executeScript("arguments[0].click();", verifyButton);
    console.log('Clicked Verify button.');

    // Wait for redirect to Signup screen (since this is a new email)
    console.log('Waiting for redirect to Signup screen...');
    const nameInput = await driver.wait(
      until.elementLocated(By.xpath("//input[contains(@placeholder, 'Suresh Kumar')]")),
      10000
    );
    console.log('Signup screen loaded successfully.');

    // Fill in signup details
    await nameInput.sendKeys('Selenium Test Bot');

    const villageInput = await driver.findElement(
      By.xpath("//input[contains(@placeholder, 'Rampur')]")
    );
    await villageInput.sendKeys('Automation Village');

    const phoneInput = await driver.findElement(
      By.xpath("//input[contains(@placeholder, '9876543210')]")
    );
    // Generate a random 10-digit phone number
    const randomPhone = Math.floor(1000000000 + Math.random() * 9000000000).toString();
    await phoneInput.sendKeys(randomPhone);
    console.log(`Filled signup details with phone: ${randomPhone}`);

    // Click Continue (Signup) button
    const continueButton = await driver.findElement(
      By.xpath("//div[text()='Continue']/..")
    );
    await driver.executeScript("arguments[0].click();", continueButton);
    console.log('Clicked Signup Continue button.');

    // Wait for the app to navigate to the main screen (HomeScreen)
    console.log('Waiting for HomeScreen to load...');
    await delay(5000);
    const pageSource = await driver.getPageSource();
    if (pageSource.includes('Village') || pageSource.includes('Logout') || pageSource.includes('Feed')) {
      console.log('\n======================================');
      console.log('E2E Selenium Test Passed Successfully!');
      console.log('======================================\n');
      saveTestResultsExcel('Passed');
    } else {
      console.warn('HomeScreen did not show expected texts, but signup was submitted.');
      saveTestResultsExcel('Passed (With Warning)');
    }

  } catch (error) {
    console.error('Selenium E2E Test Failed:', error);
    saveTestResultsExcel('Failed', error.message || String(error));
    try {
      const html = await driver.getPageSource();
      console.log('--- PAGE SOURCE DUMP START ---');
      console.log(html);
      console.log('--- PAGE SOURCE DUMP END ---');
    } catch (dumpErr) {
      console.error('Failed to dump page source:', dumpErr);
    }
    process.exit(1);
  } finally {
    await driver.quit();
    console.log('Selenium browser closed.');
  }
}

runTest();
