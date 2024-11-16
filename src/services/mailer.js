import nodemailer from "nodemailer";
import { emailTemplate } from "../../templates/emailTemplate.js";

export async function sendEmail(jobs, email = process.env.RECIPIENT_EMAIL) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: `Daily Job Listings - ${new Date().toLocaleDateString()}`,
    html: emailTemplate(jobs),
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
}
