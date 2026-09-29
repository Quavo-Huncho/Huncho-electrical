import { Resend } from "resend";

const resend = new Resend(
  process.env.RESEND_API_KEY
);

export async function sendStatusEmail(
  enquiry,
  status
) {
  let message = "";

  if (status === "In Progress") {
    message = `
      Your enquiry (${enquiry.quote_id})
      is now being reviewed by our team.
    `;
  }

  if (status === "Completed") {
    message = `
      Your enquiry (${enquiry.quote_id})
      has been completed.

      Thank you for choosing
      Huncho Electrical.
    `;
  }

  await resend.emails.send({
    from:
      "Huncho Electrical <onboarding@resend.dev>",

    to: enquiry.email,

    subject: `Enquiry Update - ${enquiry.quote_id}`,

    html: `
      <h2>Huncho Electrical</h2>

      <p>Hello ${enquiry.name},</p>

      <p>${message}</p>

      <p>
        Status:
        <strong>${status}</strong>
      </p>
    `,
  });
}