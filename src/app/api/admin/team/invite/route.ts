import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import crypto from "crypto";
import { sendAdminInvitationEmail } from "@/lib/resend";

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session || session.admin.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { email, name } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Check if admin already exists
    const existingAdmin = await prisma.admin.findUnique({ where: { email } });
    if (existingAdmin) {
      return NextResponse.json({ error: "User is already an admin" }, { status: 400 });
    }

    // Generate token
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    // Upsert invitation
    await prisma.adminInvitation.upsert({
      where: { email },
      create: {
        email,
        token,
        expiresAt,
      },
      update: {
        token,
        expiresAt,
        used: false,
      },
    });

    // Send email
    const protocol = req.headers.get("x-forwarded-proto") || "http";
    const host = req.headers.get("host");
    const setupUrl = `${protocol}://${host}/admin/setup/${token}`;
    
    await sendAdminInvitationEmail({ email, name: name || 'Colleague', setupUrl });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Invitation error:", error);
    return NextResponse.json({ error: "Failed to send invitation" }, { status: 500 });
  }
}
