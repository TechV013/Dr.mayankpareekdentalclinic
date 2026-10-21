/* =========================================================
   Inline-CSS HTML email templates (email-client safe).
   Brand: teal #0f6668, gold #c39a43, dark #173235
========================================================= */

const BASE_URL = (siteUrl) => (siteUrl || "").replace(/\/+$/, "");

const shell = (inner, siteUrl) => {
  const url = BASE_URL(siteUrl);
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="x-apple-disable-message-reformatting" />
</head>
<body style="margin:0;padding:0;background:#f4faf9;font-family:Arial,Helvetica,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4faf9;padding:24px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #dfeceb;">

          <!-- Header -->
          <tr>
            <td style="background:#ffffff;padding:20px 28px 12px;border-bottom:1px solid #e5eeee;">
              <img src="${url}/logo.png" alt="Shree Shyam Dental Care" width="200" style="display:block;height:auto;max-width:200px;" />
            </td>
          </tr>
          <tr>
            <td style="background:#0f6668;padding:12px 28px;">
              <p style="margin:0;color:#cfe9e7;font-size:12px;text-transform:uppercase;letter-spacing:2px;">
                Dr. Mayank Pareek &bull; BDS
              </p>
            </td>
          </tr>

          ${inner}

          <!-- Footer -->
          <tr>
            <td style="background:#173235;padding:22px 28px;color:#b7c9c9;font-size:12px;line-height:1.7;">
              <p style="margin:0 0 6px;color:#ffffff;font-weight:bold;">Shree Shyam Dental Care</p>
              <p style="margin:0;">Moti Bavji Choraha, Bhilwara, Rajasthan</p>
              <p style="margin:0;">
                <a href="tel:+917691082871" style="color:#c39a43;text-decoration:none;">&#9742; +91 76910 82871</a>
                &nbsp;&bull;&nbsp; Mon&ndash;Sat, 10:00 AM &ndash; 5:00 PM
              </p>
              <p style="margin:8px 0 0;">
                <a href="${url}" style="color:#8fd0cd;text-decoration:none;">Visit our website</a>
                &nbsp;&bull;&nbsp;
                <a href="https://www.google.com/maps/search/?api=1&query=25.3558725,74.6538029" style="color:#8fd0cd;text-decoration:none;">Get directions</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
};

const appointmentCard = (appointment) => `
  <tr>
    <td style="padding:24px 28px 0;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f0f8f7;border:1px solid #d7ebe8;border-radius:12px;">
        <tr>
          <td style="padding:16px 20px;">
            <p style="margin:0;font-size:11px;font-weight:bold;color:#0f6668;text-transform:uppercase;letter-spacing:1.5px;">Your Appointment Request</p>
            <p style="margin:10px 0 0;font-size:14px;color:#173235;"><strong>Date:</strong> ${appointment.date}</p>
            <p style="margin:6px 0 0;font-size:14px;color:#173235;"><strong>Time:</strong> ${appointment.time}</p>
            <p style="margin:6px 0 0;font-size:14px;color:#173235;"><strong>Concern:</strong> ${appointment.concern}</p>
            <p style="margin:10px 0 0;font-size:13px;color:#8a6a1f;">
              <strong>Status:</strong> ${appointment.status || "PENDING"} &mdash; our team will call you shortly to confirm.
            </p>
          </td>
        </tr>
      </table>
    </td>
  </tr>`;

const showcaseSection = (siteUrl) => {
  const url = BASE_URL(siteUrl);
  const gallery = ["clinic-01", "clinic-03", "clinic-05", "clinic-07"];

  return `
  <tr>
    <td style="padding:28px 28px 0;">
      <p style="margin:0;font-size:16px;font-weight:bold;color:#173235;">Take a look at our clinic</p>
      <p style="margin:6px 0 14px;font-size:13px;color:#718687;">Modern, hygienic, and comfortable &mdash; where your smile is our priority.</p>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
        <tr>
          ${gallery
            .map(
              (img, i) => `
          <td width="50%" style="padding:0 4px 8px 0;">
            <img src="${url}/clinic-gallery/${img}.png" alt="Shree Shyam Dental Care clinic photo ${i + 1}" width="270" style="width:100%;max-width:270px;height:auto;border-radius:10px;display:block;border:1px solid #e5eeee;" />
          </td>${i % 2 === 1 ? "</tr><tr>" : ""}`
            )
            .join("")}
        </tr>
      </table>
    </td>
  </tr>`;
};

const servicesSection = () => `
  <tr>
    <td style="padding:20px 28px 0;">
      <p style="margin:0;font-size:16px;font-weight:bold;color:#173235;">Our services</p>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:12px;">
        <tr>
          <td style="padding:10px 12px;background:#fff9e9;border:1px solid #ead9ad;border-radius:10px;">
            <p style="margin:0;font-size:13px;color:#173235;"><strong style="color:#8a6a1f;">Dental Checkup &amp; Cleaning</strong><br/>Complete examination and professional scaling.</p>
          </td>
        </tr>
        <tr><td style="height:8px;font-size:1px;line-height:1px;">&nbsp;</td></tr>
        <tr>
          <td style="padding:10px 12px;background:#effaf4;border:1px solid #bfe0d0;border-radius:10px;">
            <p style="margin:0;font-size:13px;color:#173235;"><strong style="color:#21643e;">Fillings &amp; Root Canal Treatment</strong><br/>Gentle restorative care to save your natural teeth.</p>
          </td>
        </tr>
        <tr><td style="height:8px;font-size:1px;line-height:1px;">&nbsp;</td></tr>
        <tr>
          <td style="padding:10px 12px;background:#f0f8f7;border:1px solid #d7ebe8;border-radius:10px;">
            <p style="margin:0;font-size:13px;color:#173235;"><strong style="color:#0f6668;">Smile Makeover &amp; Whitening</strong><br/>Cosmetic dentistry for a brighter, confident smile.</p>
          </td>
        </tr>
      </table>
    </td>
  </tr>`;

const doctorSection = () => `
  <tr>
    <td style="padding:24px 28px 8px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f8fbfa;border:1px solid #e5eeee;border-radius:12px;">
        <tr>
          <td style="padding:16px 20px;">
            <p style="margin:0;font-size:14px;color:#173235;line-height:1.7;">
              Under the care of <strong>Dr. Mayank Pareek</strong> (BDS, 5 years of experience) &mdash;
              personalized dental care with a focus on your comfort, hygiene, and long-term oral health.
            </p>
          </td>
        </tr>
      </table>
    </td>
  </tr>`;

const spacer = (px = 20) => `
  <tr><td style="height:${px}px;font-size:1px;line-height:1px;">&nbsp;</td></tr>`;

/* ---------------------------------------------------------
   Greeting + showcase (sent right after booking)
--------------------------------------------------------- */

export const greetingTemplate = ({ name, appointment, siteUrl }) =>
  shell(
    `
  <tr>
    <td style="padding:28px 28px 0;">
      <p style="margin:0;font-size:22px;font-weight:bold;color:#173235;">Welcome, ${name}! &#128075;</p>
      <p style="margin:10px 0 0;font-size:14px;color:#405e5f;line-height:1.7;">
        Thank you for choosing <strong>Shree Shyam Dental Care</strong>.
        We have received your appointment request and our team will call you shortly to confirm your visit.
      </p>
    </td>
  </tr>
  ${appointmentCard(appointment)}
  ${spacer(6)}
  ${showcaseSection(siteUrl)}
  ${servicesSection()}
  ${doctorSection()}
  `,
    siteUrl
  );

/* ---------------------------------------------------------
   Confirmation (admin confirmed the appointment)
--------------------------------------------------------- */

export const confirmationTemplate = ({ name, appointment, siteUrl }) =>
  shell(
    `
  <tr>
    <td style="padding:28px 28px 0;">
      <p style="margin:0;font-size:22px;font-weight:bold;color:#21643e;">Appointment Confirmed &#9989;</p>
      <p style="margin:10px 0 0;font-size:14px;color:#405e5f;line-height:1.7;">
        Dear ${name}, your appointment with Dr. Mayank Pareek has been <strong>confirmed</strong>.
        Please arrive 10 minutes early and carry any previous dental records if available.
      </p>
    </td>
  </tr>
  ${appointmentCard({ ...appointment, status: "CONFIRMED" })}
  ${spacer(10)}
  ${doctorSection()}`,
    siteUrl
  );

/* ---------------------------------------------------------
   Rejection (slot unavailable / unable to accommodate)
--------------------------------------------------------- */

export const rejectionTemplate = ({ name, appointment, siteUrl }) =>
  shell(
    `
  <tr>
    <td style="padding:28px 28px 0;">
      <p style="margin:0;font-size:22px;font-weight:bold;color:#8c3030;">Appointment Not Available</p>
      <p style="margin:10px 0 0;font-size:14px;color:#405e5f;line-height:1.7;">
        Dear ${name}, we are sorry &mdash; we could not accommodate your requested slot
        (${appointment.date}, ${appointment.time}). Please call us or book another time; we will be happy to help.
      </p>
    </td>
  </tr>
  <tr>
    <td style="padding:20px 28px;">
      <a href="tel:+917691082871" style="display:inline-block;background:#0f6668;color:#ffffff;text-decoration:none;padding:12px 24px;border-radius:10px;font-size:14px;font-weight:bold;">Call: +91 76910 82871</a>
    </td>
  </tr>`,
    siteUrl
  );

/* ---------------------------------------------------------
   Admin notification (new booking → clinic inbox)
--------------------------------------------------------- */

export const adminNotificationTemplate = ({ appointment }) => `
<!DOCTYPE html>
<html><body style="font-family:Arial,sans-serif;color:#173235;">
  <h2 style="color:#0f6668;">New appointment request</h2>
  <p><strong>${appointment.name}</strong> booked via the website.</p>
  <ul>
    <li>Phone: ${appointment.phone}</li>
    <li>Email: ${appointment.email}</li>
    <li>Date: ${appointment.date}</li>
    <li>Time: ${appointment.time}</li>
    <li>Concern: ${appointment.concern}</li>
    <li>Message: ${appointment.message || "-"}</li>
  </ul>
  <p>Log in to the admin panel to confirm or reject.</p>
</body></html>`;
