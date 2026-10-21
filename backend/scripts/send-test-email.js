import { sendGreetingEmail, isEmailEnabled } from "../services/emailService.js";

const to = process.argv[2] || process.env.TEST_EMAIL_TO || process.env.ADMIN_EMAIL || "";

if (!to) {
  console.log("Usage: npm run test:email -- you@example.com");
  process.exit(1);
}

if (!isEmailEnabled()) {
  console.log("SMTP is not configured. Set GMAIL_USER + GMAIL_APP_PASSWORD (or SMTP_USER + SMTP_PASS) in .env first.");
  process.exit(1);
}

console.log(`Sending test greeting email to ${to} ...`);

await sendGreetingEmail({
  to,
  name: "Test Patient",
  appointment: {
    date: "2026-11-20",
    time: "11:00",
    concern: "Dental Checkup",
    status: "PENDING",
  },
});

console.log("Done — check the inbox (and spam folder).");
