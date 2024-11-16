import cron from "node-cron";
import { scrapeJobs } from "./scraper.js";
import { sendEmail } from "./mailer.js";

export function scheduleJob() {
  // Run every day at 9 AM
  cron.schedule("0 9 * * *", async () => {
    try {
      console.log("Running scheduled job scan...");
      const jobs = await scrapeJobs();
      await sendEmail(jobs);
    } catch (error) {
      console.error("Error in scheduled job:", error);
    }
  });
}
