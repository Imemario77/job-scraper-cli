import puppeteer from "puppeteer";

export async function scrapeJobs() {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  const userAgents = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Safari/605.1.15",
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.150 Safari/537.36",
  ];

  const randomUserAgent =
    userAgents[Math.floor(Math.random() * userAgents.length)];
  // Set user agent to mimic a real browser
  await page.setUserAgent(randomUserAgent);

  // Navigate to Indeed.com
  await page.goto("https://www.indeed.com");

  // Wait for the search inputs to be available
  await page.waitForSelector("#text-input-what");

  // Example usage
  await page.waitForSelector("#text-input-where");

  // Example usage
  await delay(Math.floor(Math.random() * 2000 + 1000)); // 1-3 seconds
  // Type in the job title and location
  await page.type("#text-input-what", "Software Engineer");
  await page.type("#text-input-where", "Lagos");

  // Submit the search form
  await page.click('button[type="submit"]');

  console.log("Feting Jobs, please wait.....");
  // Wait for the search results page to
  await page.waitForNavigation();

  if ((await page.$(`.captcha-image`)) !== null) {
    console.log("Captcha detected, aborting scrape");
    await browser.close();
    return;
  }

  // Extract the job listings
  const jobListings = await page.$$eval(".resultContent", (elements) =>
    elements.map((element) => ({
      title: element
        .querySelector("h2.jobTitle span[title]")
        ?.textContent?.trim(),
      company: element
        .querySelector('div.company_location [data-testid="company-name"]')
        ?.textContent?.trim(),
      link: element.querySelector("a")?.href,
      location: element
        .querySelector('div.company_location [data-testid="text-location"]')
        ?.textContent?.trim(),
      source: "Indeed",
    }))
  );

  // Log the job listings
  for (const job of jobListings) {
    console.log(job);
  }

  // Close the browser
  await browser.close();

  return jobListings;
}

async function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
