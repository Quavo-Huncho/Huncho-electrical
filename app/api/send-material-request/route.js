import { Resend } from "resend";

const resend = new Resend(
  process.env.RESEND_API_KEY
);

export async function POST(req) {
  try {
    const body = await req.json();

    const {
      customer_name,
      customer_email,
      customer_phone,
      message,
      items,
    } = body;

    const materialsHtml = items
      .map(
        (item) =>
          `<li>${item.name} (Qty: ${item.quantity})</li>`
      )
      .join("");

    await resend.emails.send({
      from: "Huncho Electrical <onboarding@resend.dev>",
      to: process.env.NOTIFICATION_EMAIL,
      subject:
        "New Material Request",
      html: `
        <h2>New Material Request</h2>

        <p><strong>Name:</strong> ${customer_name}</p>
        <p><strong>Email:</strong> ${customer_email}</p>
        <p><strong>Phone:</strong> ${customer_phone}</p>

        <h3>Requested Materials</h3>

        <ul>
          ${materialsHtml}
        </ul>

        <h3>Customer Notes</h3>

        <p>${message || "None"}</p>
      `,
    });

    return Response.json({
      success: true,
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        error: error.message,
      },
      {
        status: 500,
      }
    );
  }
}