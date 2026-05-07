import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { token, name, password } = await req.json();

    if (!token || !name || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const invitation = await prisma.adminInvitation.findUnique({
      where: { token },
    });

    if (!invitation || invitation.used || invitation.expiresAt < new Date()) {
      return NextResponse.json({ error: "Invalid or expired invitation" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    // Create admin and mark invitation as used in a transaction
    await prisma.$transaction([
      prisma.admin.create({
        data: {
          email: invitation.email,
          name,
          password: hashedPassword,
          role: invitation.role,
        },
      }),
      prisma.adminInvitation.update({
        where: { id: invitation.id },
        data: { used: true },
      }),
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Setup completion error:", error);
    return NextResponse.json({ error: "Failed to complete setup" }, { status: 500 });
  }
}
