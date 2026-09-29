import { Resend } from "resend";

const resend = new Resend(
  process.env.RESEND_API_KEY
);

export async function sendEnquiryEmails(
  enquiry
) {
  try {
    // Email to Admin
    // Email to Admin
    const adminResult =
      await resend.emails.send({
        from:
          "Huncho Electrical <onboarding@resend.dev>",

        to: ["johnpaulchibueze98@gmail.com"],

        subject: `🔔 New Quote Request - ${enquiry.name}`,

        html: `
          <h2>Admin Test Email</h2>

          <p><strong>Name:</strong>: ${enquiry.name}</p>
          <p><strong>Email:</strong> ${enquiry.email}</p>
          <p><strong>Phone:</strong> ${enquiry.phone}</p>
          <p><strong>Service:</strong> ${enquiry.service}</p>
          <p><strong>Message:</strong> ${enquiry.message}</p>
          <p><strong>Quote ID:</strong> ${enquiry.quote_id}</p>
        `,
      });

    console.log(
      "ADMIN EMAIL RESULT:",
      adminResult
    );

    // Email to Customer
    await resend.emails.send({
      from:
        "Huncho Electrical <onboarding@resend.dev>",

      to: [enquiry.email],

      subject:
        "✅ We Received Your Request",

      html: `
        <div
          style="
            font-family:Arial,sans-serif;
            max-width:600px;
            margin:auto;
          "
        >
          <h1
            style="
              color:#f59e0b;
            "
          >
            Huncho Electrical
          </h1>

          <h2> Thank You For Contacting Us </h2>

          <p>Dear ${enquiry.name},</p>
          <p>
            We have successfully received
            your enquiry regarding
            <strong>
              ${enquiry.service}
            </strong>.
          </p>
          
          <p>
            Our team will review your
            request and contact you
            shortly.
          </p>

          <hr />
          <p><strong>Submitted Details</strong></p>

          <p>Service: ${enquiry.service}</p>
          <p>Phone: ${enquiry.phone}</p>
          <p>Message: ${enquiry.message}</p>
          <p><strong>Quote ID:</strong> ${enquiry.quote_id} </p>

          <br />

          <p>
            Regards,
          </p>

          <p>
            <strong>
              Huncho Electrical
            </strong>
          </p>
        </div>
      `,
    });

    return {
      success: true,
    };
  } catch (error) {
    console.error(error);

    return {
      success: false,
      error,
    };
  }
}

export async function sendStatusUpdateEmail(
  enquiry
) {
  try {
    await resend.emails.send({
      from:
        "Huncho Electrical <onboarding@resend.dev>",

      to: [enquiry.email],

      subject: `📋 Quote Status Update - ${enquiry.quote_id}`,

      html: `
        <div
          style="
            font-family:Arial,sans-serif;
            max-width:600px;
            margin:auto;
          "
        >
          <h1 style="color:#f59e0b;">
            Huncho Electrical
          </h1>

          <h2>
            Quote Status Update
          </h2>

          <p>
            Hello ${enquiry.name},
          </p>

          <p>
            Your quote request has been updated.
          </p>

          <p>
            <strong>Quote ID:</strong>
            ${enquiry.quote_id}
          </p>

          <p>
            <strong>Status:</strong>
            ${enquiry.status}
          </p>

          <p>
            Service:
            ${enquiry.service}
          </p>

          <br />

          <p>
            Thank you for choosing
            Huncho Electrical.
          </p>
        </div>
      `,
    });

    return {
      success: true,
    };
  } catch (error) {
    console.error(error);

    return {
      success: false,
      error,
    };
  }
}