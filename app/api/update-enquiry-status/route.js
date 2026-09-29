import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";
import { sendStatusEmail } from "@/lib/sendStatusEmail";

export async function POST(request) {
  try {
    const { id, status } = await request.json();

    const supabase = await createClient();

    // Get enquiry details
    const {
      data: enquiry,
      error: enquiryError,
    } = await supabase
      .from("enquiries")
      .select("*")
      .eq("id", id)
      .single();

    if (enquiryError) {
      throw enquiryError;
    }

    // Update status
    const { error: updateError } =
      await supabase
        .from("enquiries")
        .update({ status })
        .eq("id", id);

    if (updateError) {
      throw updateError;
    }

    // Send email only for meaningful updates
    if (
      status === "In Progress" ||
      status === "Completed"
    ) {
      await sendStatusEmail(
        enquiry,
        status
      );
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(error);

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