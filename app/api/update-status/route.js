import { NextResponse } from "next/server";

import {
  sendStatusUpdateEmail,
} from "@/lib/sendEmail";

export async function POST(request) {
  try {
    const enquiry =
      await request.json();

    await sendStatusUpdateEmail(
      enquiry
    );

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      {
        status: 500,
      }
    );
  }
}