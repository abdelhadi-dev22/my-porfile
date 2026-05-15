import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const data = await request.json();
    const { name, email, phone, service, message, website } = data;

    // Honeypot check
    if (website) {
      return NextResponse.json({ error: "Access Denied" }, { status: 403 });
    }

    // Basic validation
    if (!name || !email || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // 1. Save to database
    const contactMessage = await prisma.contactMessage.create({
      data: {
        name,
        email,
        phone: phone || null,
        service: service || null,
        message,
        ip_address: request.headers.get("x-forwarded-for") || "unknown",
      },
    });

    console.log("New contact message saved:", contactMessage);

    return NextResponse.json({
      success: true,
      message: "Message sent successfully",
    });
  } catch (error) {
    console.error("API Contact Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
