import { NextResponse } from "next/server";
import { sendEnquiryEmails } from "@/lib/sendEmail";

export async function POST(request) {
  try {
    const enquiry = await request.json();

    console.log("ENQUIRY:", enquiry);

    const result = await sendEnquiryEmails(enquiry);

    console.log("EMAIL RESULT:", result);

    return NextResponse.json(result);
  } catch (error) {
    console.error("EMAIL ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}