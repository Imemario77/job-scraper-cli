import { program } from "commander";
import { scheduleJob } from "./services/scheduler.js";
import { scrapeJobs } from "./services/scraper.js";
import { sendEmail } from "./services/mailer.js";
import { config } from "dotenv";

config();

program
  .version("1.0.0")
  .description("Job listing scraper and emailer")
  .option("-n, --now", "Run immediately instead of scheduling")
  .option(
    "-e, --email <addresses>",
    "Email addresses to send the jobs to, separated by commas"
  )
  .parse(process.argv);

const options = program.opts();

async function main() {
  try {
    if (options.now) {
      console.log("Running immediate job scan...");
      const jobs = await scrapeJobs();
      console.log("Sending mails to clients");
      await sendEmail(jobs, options.email?.split(","));
      console.log("Ending immediate job scan...");
    } else {
      console.log("Starting scheduled job scanner...");
      scheduleJob(options.email?.split(","));
    }
  } catch (error) {
    console.error("Error in main process:", error);
    process.exit(1);
  }
}

main();
